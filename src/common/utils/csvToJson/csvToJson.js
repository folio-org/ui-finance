const CSV_ERRORS = {
  readFailed: 'Failed to read the file',
  unexpectedQuote: 'Invalid CSV format: unexpected quote in unquoted field',
  unclosedQuote: 'Invalid CSV format: unclosed quoted field',
  inconsistentColumns: (rowNumber) => `Invalid CSV format: inconsistent field count in row ${rowNumber}`,
  invalidDelimiter: 'Invalid CSV format: delimiter must be a single character',
};

const DEFAULT_DELIMITER = ',';
const DELIMITER_CANDIDATES = [',', ';', '\t', '|'];
const CHAR_KIND = {
  quote: 'quote',
  recordBreak: 'recordBreak',
  other: 'other',
};

// Character constants
const CHARS = {
  quote: '"',
  newline: '\n',
  carriageReturn: '\r',
  tab: '\t',
  empty: '',
};

// Parser step constants (for lookahead/skip behavior)
const PARSER_STEP = {
  none: 0,
  one: 1,
  two: 2,
};

// Common indices
const INDICES = {
  first: 0,
  second: 1,
};

// Delimiter validation
const DELIMITER_MAX_LENGTH = 1;
const BLANK_ROW_LENGTH = 1;

const DETECTION_CHAR_BREAK_SIGNAL = { isBreak: true };

const getDetectionCharKind = (char) => {
  const CHAR_MAP = {
    [CHARS.quote]: CHAR_KIND.quote,
    [CHARS.newline]: CHAR_KIND.recordBreak,
    [CHARS.carriageReturn]: CHAR_KIND.recordBreak,
  };

  return CHAR_MAP[char] ?? CHAR_KIND.other;
};

/**
 * Extracts the first CSV record (line) from text, respecting quoted fields.
 * Stops at the first unquoted line break and ignores subsequent content.
 *
 * Purpose: Used by delimiter auto-detection to sample the file format.
 * Only examines the first data row because CSV files typically maintain consistent
 * formatting throughout. Analyzing just the first row is efficient and sufficient
 * for determining the field separator (comma, semicolon, tab, or pipe).
 *
 * @param {string} text Raw CSV text to sample
 * @returns {string} The first complete record (may contain multiple logical fields)
 */
const readFirstRecord = (text) => {
  let inQuotes = false;
  let record = '';
  let i = 0;

  const processQuote = (textArg, iArg, inQuotesArg, recordArg) => {
    const isEscaped = inQuotesArg && textArg[iArg + INDICES.second] === CHARS.quote;

    return isEscaped
      ? { record: recordArg + CHARS.quote + CHARS.quote, inQuotes: inQuotesArg, step: PARSER_STEP.two }
      : { record: recordArg + CHARS.quote, inQuotes: !inQuotesArg, step: PARSER_STEP.one };
  };

  const processRecordBreak = (inQuotesArg, recordArg, charArg) => (inQuotesArg
    ? { record: recordArg + charArg, inQuotes: inQuotesArg, step: PARSER_STEP.one }
    : DETECTION_CHAR_BREAK_SIGNAL);

  const handleCharInFirstRecord = (kind, char) => {
    const handlers = {
      [CHAR_KIND.quote]: () => processQuote(text, i, inQuotes, record),
      [CHAR_KIND.recordBreak]: () => processRecordBreak(inQuotes, record, char),
      [CHAR_KIND.other]: () => ({ record: record + char, inQuotes, step: PARSER_STEP.one }),
    };

    return (handlers[kind] || handlers[CHAR_KIND.other])();
  };

  while (i < text.length) {
    const char = text[i];
    const kind = getDetectionCharKind(char);
    const result = handleCharInFirstRecord(kind, char);

    record = result.record ?? record;
    inQuotes = result.inQuotes ?? inQuotes;

    const nextI = result.isBreak ? text.length : i + result.step;

    i = nextI;
  }

  return record;
};

/**
 * Counts occurrences of a delimiter outside of quoted fields.
 * Escaped quotes (`""`) do not affect quote state.
 *
 * Purpose: Helps identify the correct field separator in CSV auto-detection.
 * When we count delimiters outside quotes, a high count strongly indicates that
 * character is the actual delimiter (e.g., if a record has 10 semicolons outside quotes,
 * semicolon is likely the field separator). Quoted content is ignored because delimiters
 * inside quoted fields are data, not separators. Example:
 *   Input: `"Name, Inc";Age;City  -> semicolon count = 2, comma count = 0
 *   Result: Semicolon identified as delimiter
 *
 * @param {string} text Text segment to analyze (typically first record)
 * @param {string} delimiter Candidate delimiter to count
 * @returns {number} Count of delimiters appearing outside quoted fields
 */
const countDelimiterOutsideQuotes = (text, delimiter) => {
  let inQuotes = false;
  let count = 0;
  let i = 0;

  const processQuote = (textArg, iArg, inQuotesArg) => {
    const isEscaped = inQuotesArg && textArg[iArg + INDICES.second] === CHARS.quote;

    return isEscaped
      ? { inQuotes: inQuotesArg, step: PARSER_STEP.two }
      : { inQuotes: !inQuotesArg, step: PARSER_STEP.one };
  };

  const processChar = (charArg, inQuotesArg, countArg, delimiterArg) => {
    const newCount = (!inQuotesArg && charArg === delimiterArg) ? countArg + PARSER_STEP.one : countArg;

    return { inQuotes: inQuotesArg, count: newCount, step: PARSER_STEP.one };
  };

  const handleCharForDelimiterCount = (kind, char) => {
    const handlers = {
      [CHAR_KIND.quote]: () => {
        const quoteResult = processQuote(text, i, inQuotes);

        inQuotes = quoteResult.inQuotes;

        return quoteResult;
      },
      [CHAR_KIND.recordBreak]: () => ({ step: PARSER_STEP.one }),
      [CHAR_KIND.other]: () => {
        const result = processChar(char, inQuotes, count, delimiter);

        count = result.count;

        return result;
      },
    };

    return (handlers[kind] || handlers[CHAR_KIND.other])();
  };

  while (i < text.length) {
    const char = text[i];
    const kind = getDetectionCharKind(char);
    const result = handleCharForDelimiterCount(kind, char);

    i += result.step;
  }

  return count;
};

/**
 * Detects the CSV delimiter by finding which candidate appears most frequently
 * outside quoted fields in the first record. Returns null if no clear winner
 * (zero occurrences or a tie) or if auto-detection is inconclusive.
 *
 * Purpose: Automatically determines field separator without user configuration.
 * This enables the parser to handle CSV files from different locales and systems:
 * - European systems often use semicolon (;) instead of comma
 * - Tab-separated files are common for spreadsheet exports
 * - Pipe-separated values appear in some legacy systems
 *
 * Strategy:
 * 1. Extract first record (assumes consistent formatting throughout file)
 * 2. Count each candidate delimiter outside quoted fields
 * 3. Select delimiter with highest count
 * 4. Return null on tie/ambiguity to force user explicit specification (safer)
 * 5. Fallback caller applies DEFAULT_DELIMITER (comma) if no detection result
 *
 * Example: File with format "Name;Age\nAlice;30" returns ';' (1 occurrence in first record)
 * Candidates: comma (,), semicolon (;), tab (\t), pipe (|)
 *
 * @param {string} text Raw CSV text to analyze
 * @returns {string | null} Detected delimiter or null if auto-detection fails
 */
const detectDelimiter = (text) => {
  const firstRecord = readFirstRecord(text);
  const { candidates, maxCount } = DELIMITER_CANDIDATES.reduce(
    (acc, candidate) => {
      const count = countDelimiterOutsideQuotes(firstRecord, candidate);

      const isBetter = count > acc.maxCount;
      const isTiedNotEmpty = count === acc.maxCount && count > PARSER_STEP.none;

      const accumulators = {
        better: () => ({ candidates: [candidate], maxCount: count }),
        tied: () => ({ ...acc, candidates: [...acc.candidates, candidate] }),
        same: () => acc,
      };

      let strategyKey = 'same';

      if (isBetter) {
        strategyKey = 'better';
      } else if (isTiedNotEmpty) {
        strategyKey = 'tied';
      }

      return accumulators[strategyKey]();
    },
    { candidates: [], maxCount: 0 },
  );

  // No clear winner: either zero occurrences or a tie
  const hasNoWinner = maxCount === PARSER_STEP.none || candidates.length > INDICES.second;

  if (hasNoWinner) {
    return null;
  }

  return candidates[INDICES.first];
};

/**
 * CSV parser.
 * Reference: https://www.rfc-editor.org/rfc/rfc4180
 *
 * Instantiate once and call `parse(text)` to get raw string rows.
 * Use `CSVParser.toObjects(rows)` to map rows to header-keyed objects,
 * or `CSVParser.validateColumns(rows)` to assert consistent column count.
 *
 * @example
 * const parser = new CSVParser();
 * const rows = parser.parse('name,age\nAlice,30');
 * const objects = CSVParser.toObjects(rows);
 * // [{ name: 'Alice', age: '30' }]
 */
export class CSVParser {
  /** @type {string[][]} */
  #rows = [];

  /** @type {string[]} */
  #row = [];

  /** @type {string} */
  #field = '';

  /** @type {boolean} */
  #inQuotes = false;

  /** @type {string} */
  #delimiter = DEFAULT_DELIMITER;

  static #PARSER_CHAR_KIND = {
    quote: 'quote',
    delimiter: 'delimiter',
    recordBreak: 'recordBreak',
    other: 'other',
  };

  /**
   * Constructor with optional delimiter configuration.
   *
   * Purpose: Initialize parser with a specific field separator. Validates that delimiter
   * is a single character (CSV spec). If no delimiter provided, DEFAULT_DELIMITER (comma)
   * will be used as fallback.
   *
   * @param {{ delimiter?: string }} [options] Configuration object
   * @throws {Error} If delimiter is not a single character string
   */
  constructor(options = {}) {
    const { delimiter = DEFAULT_DELIMITER } = options;

    if (typeof delimiter !== 'string' || delimiter.length !== DELIMITER_MAX_LENGTH) {
      throw new Error(CSV_ERRORS.invalidDelimiter);
    }

    this.#delimiter = delimiter;
  }

  // ─── Private static helpers ───────────────────────────────────────────────

  /**
   * Checks if a row represents a blank physical line (one empty field).
   *
   * Purpose: Filters out blank lines that sometimes appear in CSV files due to
   * formatting or encoding issues. These are artifacts, not actual data.
   * A blank row has exactly one field with an empty string.
   *
   * @param {string[]} row Parsed row to check
   * @returns {boolean} True if row is ['']
   */
  static #isBlankRow(row) {
    return row.length === BLANK_ROW_LENGTH && row[INDICES.first] === CHARS.empty;
  }

  /**
   * Creates a mapper function that transforms a row array into a header-keyed object.
   *
   * Purpose: Converts raw CSV rows (arrays) to JavaScript objects with named properties.
   * This makes data easier to work with in application code (access by field name instead
   * of index). Missing values default to empty strings for consistent handling.
   *
   * Example:
   *   Headers: ['name', 'age', 'city']
   *   Row: ['Alice', '30']  -> { name: 'Alice', age: '30', city: '' }
   *
   * @param {string[]} headers Column names to use as object keys
   * @returns {(row: string[]) => Record<string, string>} Mapper function
   */
  static #mapRowToObject(headers) {
    return (row) => headers.reduce((acc, header, index) => {
      acc[header] = row[index] ?? '';

      return acc;
    }, {});
  }

  /**
   * Validates that all rows have the same column count.
   *
   * Purpose: Detects malformed CSV where rows have inconsistent field counts.
   * This usually indicates:
   * - Unescaped delimiters inside quoted fields (parser bug)
   * - Manually edited CSV files with formatting errors
   * - File corruption or encoding issues
   * Throws with row number to help identify problem location.
   *
   * @param {string[][]} rows Parsed rows to validate
   * @returns {void}
   * @throws {Error} If any row has different column count than first row
   */
  static #assertConsistentColumns(rows) {
    const expectedLength = rows[INDICES.first]?.length ?? PARSER_STEP.none;
    const invalidRow = rows.find((row) => row.length !== expectedLength);

    if (invalidRow) {
      const rowNumber = rows.indexOf(invalidRow) + INDICES.second;

      throw new Error(CSV_ERRORS.inconsistentColumns(rowNumber));
    }
  }

  /**
   * Resolves a `"` character encountered inside a quoted field.
   *
   * Purpose: Handles CSV quoting rules per RFC 4180:
   * - `""` inside quotes = escaped literal quote character (stays in quoted mode)
   * - `"` alone = closing quote (exits quoted mode)
   *
    * This is the core of proper CSV parsing. Example:
    *   Input: "Hello ""World"""  ->  outputs: Hello "World"
   *   Input: "Name",Age,City  ->  closing quote, then comma = field separator
   *
   * @param {string} text Full CSV text
   * @param {number} index Position of the current quote character
   * @returns {{ escaped: boolean, indexStep: number }} Whether quote is escaped and how many chars to skip
   */
  static #resolveQuotedQuote(text, index) {
    const isEscaped = text[index + INDICES.second] === CHARS.quote;

    return { escaped: isEscaped, indexStep: isEscaped ? PARSER_STEP.one : PARSER_STEP.none };
  }

  // ─── Private instance methods (parser state transitions) ──────────────────

  /**
   * Finalizes current row: commits open field to row, records row if not blank.
   *
   * Purpose: State accumulator cleanup at record boundaries (newlines, EOF).
   * Moves field and row data into #rows array, skipping blank lines.
   * Always resets field and row for next parsing cycle.
   */
  #finalizeCurrentRow() {
    const completedRow = [...this.#row, this.#field];

    if (!CSVParser.#isBlankRow(completedRow)) {
      this.#rows.push(completedRow);
    }

    this.#row = [];
    this.#field = CHARS.empty;
  }

  /**
   * Processes one character while parser is inside a quoted field.
   *
   * Purpose: State machine for quoted field parsing.
   * Inside quotes, only two things matter:
   * - A `"` character (could be escape or close quote) → delegate to quote handler
   * - Any other character → append to current field (including delimiters, newlines)
   * Uses declarative handlers map instead of if-chains for clarity.
   *
   * @param {string} char Character to process
   * @param {string} text Full CSV text (context for lookahead)
   * @param {number} index Current position
   * @returns {number} Characters to skip (0 or 1 for `""` escape)
   */
  #processQuotedChar(char, text, index) {
    const handlers = {
      [CSVParser.#PARSER_CHAR_KIND.quote]: () => this.#handleQuotedQuote(text, index),
      [CSVParser.#PARSER_CHAR_KIND.other]: () => this.#appendToField(char),
    };

    const kind = char === '"'
      ? CSVParser.#PARSER_CHAR_KIND.quote
      : CSVParser.#PARSER_CHAR_KIND.other;

    return handlers[kind]();
  }

  /**
   * Processes one character while parser is outside a quoted field.
   *
   * Purpose: State machine for unquoted field parsing.
   * Outside quotes, characters have structural meaning:
   * - `"` → opens a quoted section (must be at field start, or error)
   * - Delimiter → ends current field, starts new field
   * - Newline/CR → ends field and row
   * - Anything else → append to field
   * Dispatcher pattern keeps this branch from becoming nested if-hell.
   *
   * @param {string} char Character to process
   * @param {string} text Full CSV text (context for CRLF detection)
   * @param {number} index Current position
   * @returns {number} Characters to skip (1 for CR in CRLF pair)
   */
  #processUnquotedChar(char, text, index) {
    const handlers = {
      [CSVParser.#PARSER_CHAR_KIND.quote]: () => this.#openQuotedField(),
      [CSVParser.#PARSER_CHAR_KIND.delimiter]: () => this.#commitField(),
      [CSVParser.#PARSER_CHAR_KIND.recordBreak]: () => this.#commitRecordBreak(char, text, index),
      [CSVParser.#PARSER_CHAR_KIND.other]: () => this.#appendToField(char),
    };

    return handlers[this.#getParserCharKind(char)]();
  }

  #appendToField(char) {
    this.#field = `${this.#field}${char}`;

    return PARSER_STEP.none;
  }

  #openQuotedField() {
    if (this.#field.length > PARSER_STEP.none) {
      throw new Error(CSV_ERRORS.unexpectedQuote);
    }

    this.#inQuotes = true;

    return PARSER_STEP.none;
  }

  #commitField() {
    this.#row = [...this.#row, this.#field];
    this.#field = CHARS.empty;

    return PARSER_STEP.none;
  }

  #commitRecordBreak(char, text, index) {
    this.#finalizeCurrentRow();
    const isCRLF = char === CHARS.carriageReturn && text[index + INDICES.second] === CHARS.newline;

    return isCRLF ? PARSER_STEP.one : PARSER_STEP.none;
  }

  #handleQuotedQuote(text, index) {
    const { escaped, indexStep } = CSVParser.#resolveQuotedQuote(text, index);

    if (escaped) {
      this.#field = `${this.#field}${CHARS.quote}`;
    } else {
      this.#inQuotes = false;
    }

    return indexStep;
  }

  #getParserCharKind(char) {
    const CHAR_KIND_MAP = {
      '"': () => CSVParser.#PARSER_CHAR_KIND.quote,
      [this.#delimiter]: () => CSVParser.#PARSER_CHAR_KIND.delimiter,
      '\r': () => CSVParser.#PARSER_CHAR_KIND.recordBreak,
      '\n': () => CSVParser.#PARSER_CHAR_KIND.recordBreak,
    };

    return (CHAR_KIND_MAP[char]?.() ?? CSVParser.#PARSER_CHAR_KIND.other);
  }

  /** Resets all parser state so the instance can be reused. */
  #reset() {
    this.#rows = [];
    this.#row = [];
    this.#field = CHARS.empty;
    this.#inQuotes = false;
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  /**
   * Parses CSV text into a 2D array of strings (rows and fields).
   *
   * Purpose: Core parsing logic. Implements RFC 4180-style state machine that processes
   * character-by-character, maintaining state (#inQuotes, #field, #row, #rows).
   * Handles all CSV quoting complexities: escaped quotes, multiline values, various line endings.
   *
   * Reference: https://www.rfc-editor.org/rfc/rfc4180
   *
   * @param {unknown} input Raw CSV string. Non-string values treated as empty input.
   * @returns {string[][]} 2D array where each row is array of field strings
   * @throws {Error} On malformed CSV (unclosed quote, unexpected quote in unquoted field)
   */
  parse(input) {
    this.#reset();

    const text = (typeof input === 'string') ? input : '';

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const indexStep = this.#inQuotes
        ? this.#processQuotedChar(char, text, i)
        : this.#processUnquotedChar(char, text, i);

      i += indexStep;
    }

    if (this.#inQuotes) {
      throw new Error(CSV_ERRORS.unclosedQuote);
    }

    const hasPendingData = this.#row.length > PARSER_STEP.none || this.#field.length > PARSER_STEP.none;

    if (hasPendingData) {
      this.#finalizeCurrentRow();
    }

    return this.#rows;
  }

  /**
   * Converts raw rows into an array of header-keyed objects.
   *
   * Purpose: Transforms parser output (2D arrays) into JavaScript objects for
   * convenient data access. First row becomes header names, subsequent rows
   * become objects with those header values.
   *
   * Usage: Call after parse() if you want objects instead of raw arrays.
   * Example:
   *   rows = [['name', 'age'], ['Alice', '30']]
   *   toObjects(rows) => [{ name: 'Alice', age: '30' }]
   *
   * @param {string[][]} rows Raw parsed rows from parse()
   * @returns {Record<string, string>[]} Array of objects, empty if rows is empty
   * @throws {Error} If rows have inconsistent column counts
   */
  static toObjects(rows) {
    const [headers = [], ...dataRows] = rows;
    const hasHeaders = headers.length > PARSER_STEP.none;

    if (hasHeaders) {
      CSVParser.#assertConsistentColumns([headers, ...dataRows]);
    }

    return hasHeaders ? dataRows.map(CSVParser.#mapRowToObject(headers)) : [];
  }

  /**
   * Validates that all rows have the same number of columns.
   *
   * Purpose: Public validation API when you want to check parsed data
   * before further processing. Throws descriptive error on first inconsistent row
   * to help identify formatting problems. Useful for strict data validation.
   *
   * @param {string[][]} rows Parsed rows from parse()
   * @returns {void}
   * @throws {Error} If any row has different column count than first row
   */
  static validateColumns(rows) {
    CSVParser.#assertConsistentColumns(rows);
  }
}

/**
 * Reads a CSV file and returns parsed data as JavaScript objects or arrays.
 *
 * Purpose: High-level public API that handles entire CSV workflow:
 * 1. File reading (with error handling)
 * 2. Delimiter auto-detection (attempts to identify separator automatically)
 * 3. CSV parsing (handles quoting, escaping, multiline values)
 * 4. Format conversion (optionally transforms to objects with named properties)
 *
 * This enables:
 * - Importing CSV files from user uploads
 * - Handling CSV files from different locales (semicolon, tab-separated, etc.)
 * - Simple object-based data binding in UI components
 * - Automatic format inference without configuration
 *
 * Reference: https://www.rfc-editor.org/rfc/rfc4180
 *
 * @param {{ text?: () => Promise<string> }} file File-like object (Blob, File, etc.) with async text() method
 * @param {{ headers?: boolean, delimiter?: string }} [options] Optional configuration
 *   - `headers` (default true): Convert rows to objects with column names from first row?
 *   - `delimiter` (optional): Explicit field separator. If omitted, auto-detects from `,;|\t` with fallback to `,`
 * @returns {Promise<Record<string, string>[] | string[][]>} Array of objects (if headers=true) or 2D string array
 * @throws {Error} On file read failure or CSV format errors (unclosed quotes, inconsistent columns)
 *
 * @example
 * // Usage with headers (returns objects)
 * const file = await fileInput.files[0];
 * const data = await csvToJson(file);
 * // [{name: 'Alice', age: '30'}, {name: 'Bob', age: '25'}]
 *
 * @example
 * // Explicit delimiter for semicolon-separated file
 * const data = await csvToJson(file, { delimiter: ';' });
 *
 * @example
 * // Raw arrays without object transformation
 * const data = await csvToJson(file, { headers: false });
 */
export const csvToJson = async (file, options = {}) => {
  const {
    headers: includeHeaders = true,
    delimiter,
  } = options;

  let text;

  try {
    text = await file?.text();

    if (typeof text !== 'string') {
      throw new Error(CSV_ERRORS.readFailed);
    }
  } catch {
    throw new Error(CSV_ERRORS.readFailed);
  }

  const resolvedDelimiter = delimiter ?? detectDelimiter(text) ?? DEFAULT_DELIMITER;
  const parser = new CSVParser({ delimiter: resolvedDelimiter });
  const rows = parser.parse(text);

  if (!includeHeaders) {
    CSVParser.validateColumns(rows);
  }

  return includeHeaders ? CSVParser.toObjects(rows) : rows;
};
