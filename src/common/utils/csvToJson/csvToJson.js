const CSV_ERRORS = {
  readFailed: 'Failed to read the file',
  unexpectedQuote: 'Invalid CSV format: unexpected quote in unquoted field',
  unclosedQuote: 'Invalid CSV format: unclosed quoted field',
  inconsistentColumns: (rowNumber) => `Invalid CSV format: inconsistent field count in row ${rowNumber}`,
};

/**
 * RFC 4180-compatible CSV parser.
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

  // ─── Private static helpers ───────────────────────────────────────────────

  /**
   * Returns true when a row represents a blank physical line (one empty field).
   *
   * @param {string[]} row
   * @returns {boolean}
   */
  static #isBlankRow(row) {
    return row.length === 1 && row[0] === '';
  }

  /**
   * Creates a mapper from a parsed row array to a header-keyed object.
   * Missing values are normalized to empty strings.
   *
   * @param {string[]} headers
   * @returns {(row: string[]) => Record<string, string>}
   */
  static #mapRowToObject(headers) {
    return (row) => headers.reduce((acc, header, index) => {
      acc[header] = row[index] ?? '';

      return acc;
    }, {});
  }

  /**
   * Throws if any row has a different column count than the first row.
   *
   * @param {string[][]} rows
   * @returns {void}
   */
  static #assertConsistentColumns(rows) {
    if (!rows.length) {
      return;
    }

    const expectedLength = rows[0].length;

    rows.forEach((row, index) => {
      if (row.length !== expectedLength) {
        throw new Error(CSV_ERRORS.inconsistentColumns(index + 1));
      }
    });
  }

  /**
   * Resolves a `"` character encountered inside a quoted field.
   * `""` → escaped literal `"` (stays in quoted mode).
   * `"` alone → closes the quoted segment.
   *
   * Returns the number of extra characters consumed (0 or 1).
   *
   * @param {string} text Full CSV text.
   * @param {number} index Position of the closing/escape `"`.
   * @returns {{ escaped: boolean, indexStep: number }}
   */
  static #resolveQuotedQuote(text, index) {
    if (text[index + 1] === '"') {
      return { escaped: true, indexStep: 1 };
    }

    return { escaped: false, indexStep: 0 };
  }

  // ─── Private instance methods (parser state transitions) ──────────────────

  /**
   * Appends the current field to the row and records the row unless it is blank.
   * Resets field and row accumulators afterwards.
   */
  #finalizeCurrentRow() {
    const completedRow = [...this.#row, this.#field];

    if (!CSVParser.#isBlankRow(completedRow)) {
      this.#rows.push(completedRow);
    }

    this.#row = [];
    this.#field = '';
  }

  /**
   * Processes one character while the parser is inside a quoted field.
   * Returns the number of extra index positions to skip (0 or 1).
   *
   * @param {string} char
   * @param {string} text
   * @param {number} index
   * @returns {number}
   */
  #processQuotedChar(char, text, index) {
    if (char !== '"') {
      this.#field = `${this.#field}${char}`;

      return 0;
    }

    const { escaped, indexStep } = CSVParser.#resolveQuotedQuote(text, index);

    if (escaped) {
      this.#field = `${this.#field}"`;
    } else {
      this.#inQuotes = false;
    }

    return indexStep;
  }

  /**
   * Processes one character while the parser is outside a quoted field.
   * Returns the number of extra index positions to skip (0 or 1).
   *
   * @param {string} char
   * @param {string} text
   * @param {number} index
   * @returns {number}
   */
  #processUnquotedChar(char, text, index) {
    if (char === '"') {
      if (this.#field.length > 0) {
        throw new Error(CSV_ERRORS.unexpectedQuote);
      }

      this.#inQuotes = true;

      return 0;
    }

    if (char === ',') {
      this.#row = [...this.#row, this.#field];
      this.#field = '';

      return 0;
    }

    if (char === '\r' || char === '\n') {
      this.#finalizeCurrentRow();

      return char === '\r' && text[index + 1] === '\n' ? 1 : 0;
    }

    this.#field = `${this.#field}${char}`;

    return 0;
  }

  /** Resets all parser state so the instance can be reused. */
  #reset() {
    this.#rows = [];
    this.#row = [];
    this.#field = '';
    this.#inQuotes = false;
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  /**
   * Parses CSV text into an array of rows (each row is an array of strings).
   * Follows RFC 4180 quoting rules: quoted fields may contain commas, newlines,
   * and `""` sequences that represent a literal double-quote.
   *
   * @param {unknown} input Raw CSV string. Non-string values are treated as empty input.
   * @returns {string[][]}
   */
  parse(input) {
    this.#reset();

    const text = typeof input === 'string' ? input : '';

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

    if (this.#row.length > 0 || this.#field.length > 0) {
      this.#finalizeCurrentRow();
    }

    return this.#rows;
  }

  /**
   * Converts raw rows (from `parse()`) into header-keyed objects.
   * The first row is used as the header row and is not included in the result.
   * Returns an empty array when the input has no rows.
   *
   * @param {string[][]} rows
   * @returns {Record<string, string>[]}
   */
  static toObjects(rows) {
    const [headers = [], ...dataRows] = rows;

    if (!headers.length) {
      return [];
    }

    CSVParser.#assertConsistentColumns([headers, ...dataRows]);

    return dataRows.map(CSVParser.#mapRowToObject(headers));
  }

  /**
   * Validates that all rows have the same number of columns.
   * Throws a descriptive error on the first inconsistent row.
   *
   * @param {string[][]} rows
   * @returns {void}
   */
  static validateColumns(rows) {
    CSVParser.#assertConsistentColumns(rows);
  }
}

/**
 * Reads a CSV file and returns parsed data as JSON.
 *
 * Thin async wrapper around {@link CSVParser} that handles file reading
 * and surfaces a single consistent error on I/O failure.
 *
 * @param {{ text?: () => Promise<string> }} file File-like object with a Blob-compatible `text()` method.
 * @param {{ headers?: boolean }} [options]
 *   - `headers` (default `true`): when true, the first row is treated as column names
 *     and the result is an array of objects; when false, returns raw string arrays.
 * @returns {Promise<Record<string, string>[] | string[][]>}
 */
export const csvToJson = async (file, options = {}) => {
  const { headers: includeHeaders = true } = options;

  let text;

  try {
    text = await file?.text();
  } catch {
    throw new Error(CSV_ERRORS.readFailed);
  }

  const parser = new CSVParser();
  const rows = parser.parse(text);

  if (includeHeaders) {
    return CSVParser.toObjects(rows);
  }

  CSVParser.validateColumns(rows);

  return rows;
};
