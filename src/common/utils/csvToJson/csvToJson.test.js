import { csvToJson } from './csvToJson';

const createFileMock = ({ result = '', shouldFail = false } = {}) => ({
  text: shouldFail
    ? jest.fn().mockRejectedValue(new Error('File read failed'))
    : jest.fn().mockResolvedValue(result),
});

describe('csvToJson', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('parses basic CSV with headers', async () => {
    const file = createFileMock({
      result: 'name,amount\ncoffee,10',
    });

    await expect(csvToJson(file)).resolves.toEqual([
      { name: 'coffee', amount: '10' },
    ]);
  });

  it('supports quoted fields with commas and escaped quotes', async () => {
    const file = createFileMock({
      result: 'name,note\n"Doe, John","He said ""hello"""',
    });

    await expect(csvToJson(file)).resolves.toEqual([
      { name: 'Doe, John', note: 'He said "hello"' },
    ]);
  });

  it('supports CRLF and multiline values inside quoted fields', async () => {
    const file = createFileMock({
      result: 'id,comment\r\n1,"first line\r\nsecond line"\r\n2,"single line"',
    });

    await expect(csvToJson(file)).resolves.toEqual([
      { id: '1', comment: 'first line\r\nsecond line' },
      { id: '2', comment: 'single line' },
    ]);
  });

  it('returns array rows when headers option is disabled', async () => {
    const file = createFileMock({
      result: 'a,b\n1,2',
    });

    await expect(csvToJson(file, { headers: false })).resolves.toEqual([
      ['a', 'b'],
      ['1', '2'],
    ]);
  });

  it('ignores completely blank lines but keeps intentionally empty fields', async () => {
    const file = createFileMock({
      result: 'a,b\n\n1,\n,2\n\n',
    });

    await expect(csvToJson(file, { headers: false })).resolves.toEqual([
      ['a', 'b'],
      ['1', ''],
      ['', '2'],
    ]);
  });

  it('rejects malformed CSV with unclosed quoted field', async () => {
    const file = createFileMock({
      result: 'a,b\n"unterminated,1',
    });

    await expect(csvToJson(file)).rejects.toThrow('unclosed quoted field');
  });

  it('rejects malformed CSV with unexpected quote in unquoted field', async () => {
    const file = createFileMock({
      result: 'a,b\nabc"def,1',
    });

    await expect(csvToJson(file)).rejects.toThrow('unexpected quote in unquoted field');
  });

  it('rejects rows with inconsistent field count when headers are enabled', async () => {
    const file = createFileMock({
      result: 'a,b\n1,2,3',
    });

    await expect(csvToJson(file)).rejects.toThrow('inconsistent field count');
  });

  it('rejects rows with inconsistent field count when headers are disabled', async () => {
    const file = createFileMock({
      result: '1,2\n3',
    });

    await expect(csvToJson(file, { headers: false })).rejects.toThrow('inconsistent field count');
  });

  it('returns empty array for an empty file', async () => {
    const file = createFileMock({ result: '' });

    await expect(csvToJson(file)).resolves.toEqual([]);
  });

  it('propagates file reading errors', async () => {
    const file = createFileMock({ shouldFail: true });

    await expect(csvToJson(file)).rejects.toThrow('Failed to read the file');
  });

  it('rejects when file is missing', async () => {
    await expect(csvToJson()).rejects.toThrow('Failed to read the file');
  });

  it('rejects when file.text() resolves to non-string', async () => {
    const file = {
      text: jest.fn().mockResolvedValue(undefined),
    };

    await expect(csvToJson(file)).rejects.toThrow('Failed to read the file');
  });

  describe('delimiter options', () => {
    it('parses semicolon-separated data when delimiter is explicitly provided', async () => {
      const file = createFileMock({
        result: 'name;amount\ncoffee;10',
      });

      await expect(csvToJson(file, { delimiter: ';' })).resolves.toEqual([
        { name: 'coffee', amount: '10' },
      ]);
    });

    it('auto-detects semicolon as delimiter when option is omitted', async () => {
      const file = createFileMock({
        result: 'name;amount\ncoffee;10',
      });

      await expect(csvToJson(file)).resolves.toEqual([
        { name: 'coffee', amount: '10' },
      ]);
    });

    it('falls back to comma when delimiter auto-detection is ambiguous', async () => {
      const file = createFileMock({
        result: 'a,b;c\n1,2;3',
      });

      await expect(csvToJson(file)).resolves.toEqual([
        { a: '1', 'b;c': '2;3' },
      ]);
    });

    it('ignores delimiters inside quoted header fields during auto-detection', async () => {
      const file = createFileMock({
        result: '"a;b",c\n"1;2",3',
      });

      await expect(csvToJson(file)).resolves.toEqual([
        { 'a;b': '1;2', c: '3' },
      ]);
    });

    it('rejects invalid delimiter option values', async () => {
      const file = createFileMock({ result: 'a,b\n1,2' });

      await expect(csvToJson(file, { delimiter: '::' })).rejects.toThrow('delimiter must be a single character');
    });
  });

  describe('quoting edge cases', () => {
    it('quoted field that is the only field on a data row', async () => {
      const file = createFileMock({ result: 'note\n"only one field"' });

      await expect(csvToJson(file)).resolves.toEqual([{ note: 'only one field' }]);
    });

    it('quoted field containing only commas', async () => {
      const file = createFileMock({ result: 'a,b\n",,,",' });

      await expect(csvToJson(file)).resolves.toEqual([{ a: ',,,', b: '' }]);
    });

    it('adjacent quoted fields separated by a comma', async () => {
      const file = createFileMock({ result: 'a,b\n"foo","bar"' });

      await expect(csvToJson(file)).resolves.toEqual([{ a: 'foo', b: 'bar' }]);
    });

    it('quoted field containing exactly one double-quote via ""', async () => {
      const file = createFileMock({ result: 'a\n""""' });

      await expect(csvToJson(file)).resolves.toEqual([{ a: '"' }]);
    });

    it('quoted field with multiple pairs of escaped quotes', async () => {
      const file = createFileMock({ result: 'a\n"one ""two"" three"' });

      await expect(csvToJson(file)).resolves.toEqual([{ a: 'one "two" three' }]);
    });

    it('quoted field at the end of a row without trailing content', async () => {
      const file = createFileMock({ result: 'a,b,c\n1,2,"end"' });

      await expect(csvToJson(file)).resolves.toEqual([{ a: '1', b: '2', c: 'end' }]);
    });

    it('empty quoted field ("") is treated as an empty string', async () => {
      const file = createFileMock({ result: 'a,b\n"",x' });

      await expect(csvToJson(file)).resolves.toEqual([{ a: '', b: 'x' }]);
    });

    it('header row with quoted names maps correctly', async () => {
      const file = createFileMock({ result: '"first name","last name"\nJane,Doe' });

      await expect(csvToJson(file)).resolves.toEqual([{ 'first name': 'Jane', 'last name': 'Doe' }]);
    });

    it('quoted field containing a newline in LF-only file', async () => {
      const file = createFileMock({ result: 'id,v\n1,"line1\nline2"' });

      await expect(csvToJson(file)).resolves.toEqual([{ id: '1', v: 'line1\nline2' }]);
    });

    it('mix of quoted and unquoted fields in the same row', async () => {
      const file = createFileMock({ result: 'a,b,c\nunquoted,"quo,ted",plain' });

      await expect(csvToJson(file)).resolves.toEqual([{ a: 'unquoted', b: 'quo,ted', c: 'plain' }]);
    });

    it('value with comma is unambiguous only when quoted', async () => {
      const file = createFileMock({ result: 'a,b\n"a,b","c,d"' });

      await expect(csvToJson(file)).resolves.toEqual([{ a: 'a,b', b: 'c,d' }]);
    });

    it('trailing comma on header row produces an empty-string key', async () => {
      const file = createFileMock({ result: 'a,\n1,2' });

      await expect(csvToJson(file)).resolves.toEqual([{ a: '1', '': '2' }]);
    });

    it('all fields quoted across multiple rows', async () => {
      const file = createFileMock({ result: '"x","y"\n"1","2"\n"3","4"' });

      await expect(csvToJson(file)).resolves.toEqual([
        { x: '1', y: '2' },
        { x: '3', y: '4' },
      ]);
    });

    it('rejects quote that appears mid-field after non-quote characters', async () => {
      const file = createFileMock({ result: 'a\nhello"world' });

      await expect(csvToJson(file)).rejects.toThrow('unexpected quote in unquoted field');
    });

    it('rejects unclosed quote spanning two logical rows', async () => {
      const file = createFileMock({ result: 'a,b\n"open\nnever closed' });

      await expect(csvToJson(file)).rejects.toThrow('unclosed quoted field');
    });
  });

  describe('special characters and unicode', () => {
    it('handles unicode characters in unquoted fields', async () => {
      const file = createFileMock({
        result: 'name,city\nAlice,Москва\nBob,北京',
      });

      await expect(csvToJson(file)).resolves.toEqual([
        { name: 'Alice', city: 'Москва' },
        { name: 'Bob', city: '北京' },
      ]);
    });

    it('handles emoji in quoted fields', async () => {
      const file = createFileMock({
        result: 'name,mood\n"Alice 😀","Happy 🎉"',
      });

      await expect(csvToJson(file)).resolves.toEqual([
        { name: 'Alice 😀', mood: 'Happy 🎉' },
      ]);
    });

    it('handles accented characters and diacritics', async () => {
      const file = createFileMock({
        result: 'name,city\nJosé,Montréal\nMüller,Zürich',
      });

      await expect(csvToJson(file)).resolves.toEqual([
        { name: 'José', city: 'Montréal' },
        { name: 'Müller', city: 'Zürich' },
      ]);
    });

    it('handles tab characters within quoted fields', async () => {
      const file = createFileMock({
        result: 'a,b\n"col\twith\ttabs","normal"',
      });

      await expect(csvToJson(file)).resolves.toEqual([
        { a: 'col\twith\ttabs', b: 'normal' },
      ]);
    });

    it('handles special regex characters ($, ^, *, +, ?, ., |, [, ])', async () => {
      const file = createFileMock({
        result: 'pattern,escaped\n"$100","^top|bottom[x]"',
      });

      await expect(csvToJson(file)).resolves.toEqual([
        { pattern: '$100', escaped: '^top|bottom[x]' },
      ]);
    });

    it('handles backslashes and forward slashes', async () => {
      const file = createFileMock({
        result: 'path,url\n"/usr/local/data","http://example.com/path/file"',
      });

      await expect(csvToJson(file)).resolves.toEqual([
        { path: '/usr/local/data', url: 'http://example.com/path/file' },
      ]);
    });

    it('handles HTML and XML special characters', async () => {
      const file = createFileMock({
        result: 'html,xml\n"<tag>","&entity;"',
      });

      await expect(csvToJson(file)).resolves.toEqual([
        { html: '<tag>', xml: '&entity;' },
      ]);
    });

    it('handles single quotes mixed with double quotes', async () => {
      const file = createFileMock({
        result: "name,comment\n\"It's perfect\",test",
      });

      await expect(csvToJson(file)).resolves.toEqual([
        { name: 'It\'s perfect', comment: 'test' },
      ]);
    });

    it('handles fields with only whitespace', async () => {
      const file = createFileMock({
        result: 'a,b,c\n"   ","","\t"',
      });

      await expect(csvToJson(file)).resolves.toEqual([
        { a: '   ', b: '', c: '\t' },
      ]);
    });

    it('handles multiple consecutive spaces in unquoted fields', async () => {
      const file = createFileMock({
        result: 'a,b\nspaced  out,normal',
      });

      await expect(csvToJson(file)).resolves.toEqual([
        { a: 'spaced  out', b: 'normal' },
      ]);
    });

    it('handles very long fields (>1000 chars)', async () => {
      const longString = 'x'.repeat(5000);
      const file = createFileMock({
        result: `name,description\nAlice,"${longString}"`,
      });

      await expect(csvToJson(file)).resolves.toEqual([
        { name: 'Alice', description: longString },
      ]);
    });

    it('handles parentheses and curly braces in quoted fields', async () => {
      const file = createFileMock({
        result: 'code,data\n"fn()","{ key: value }"',
      });

      await expect(csvToJson(file)).resolves.toEqual([
        { code: 'fn()', data: '{ key: value }' },
      ]);
    });

    it('handles JSON structure in a field', async () => {
      const file = createFileMock({
        result: 'id,metadata\n1,"{""name"":""Alice"",""age"":30}"',
      });

      await expect(csvToJson(file)).resolves.toEqual([
        { id: '1', metadata: '{"name":"Alice","age":30}' },
      ]);
    });

    it('handles null byte and control characters (preserves them)', async () => {
      const file = createFileMock({
        result: 'a,b\n"text\u0000null","normal"',
      });

      await expect(csvToJson(file)).resolves.toEqual([
        { a: 'text\u0000null', b: 'normal' },
      ]);
    });

    it('handles pipe separator option with special characters', async () => {
      const file = createFileMock({
        result: 'name|value\nAlice|$100.50\nBob|€50,00',
      });

      await expect(csvToJson(file, { delimiter: '|' })).resolves.toEqual([
        { name: 'Alice', value: '$100.50' },
        { name: 'Bob', value: '€50,00' },
      ]);
    });

    it('handles tab separator option', async () => {
      const file = createFileMock({
        result: 'name\tvalue\nAlice\tData with quoted text',
      });

      await expect(csvToJson(file, { delimiter: '\t' })).resolves.toEqual([
        { name: 'Alice', value: 'Data with quoted text' },
      ]);
    });

    it('handles minus and plus signs in numeric strings', async () => {
      const file = createFileMock({
        result: 'value,amount\n+100,-50\n-0,+0',
      });

      await expect(csvToJson(file)).resolves.toEqual([
        { value: '+100', amount: '-50' },
        { value: '-0', amount: '+0' },
      ]);
    });

    it('handles decimal and exponential notation', async () => {
      const file = createFileMock({
        result: 'price,scientific\n3.14159,1.23e-4\n0.001,2E+3',
      });

      await expect(csvToJson(file)).resolves.toEqual([
        { price: '3.14159', scientific: '1.23e-4' },
        { price: '0.001', scientific: '2E+3' },
      ]);
    });

    it('handles percent signs and currency symbols', async () => {
      const file = createFileMock({
        result: 'name,value\n"10%","$100.00 / €85.50"',
      });

      await expect(csvToJson(file)).resolves.toEqual([
        { name: '10%', value: '$100.00 / €85.50' },
      ]);
    });

    it('handles equals and comparison operators in fields', async () => {
      const file = createFileMock({
        result: 'operator,test\n"a=b","x>=y AND z<w"',
      });

      await expect(csvToJson(file)).resolves.toEqual([
        { operator: 'a=b', test: 'x>=y AND z<w' },
      ]);
    });

    it('handles asterisks and dots in filenames', async () => {
      const file = createFileMock({
        result: 'filename,size\n"*.txt",100\n"test.*.backup",250',
      });

      await expect(csvToJson(file)).resolves.toEqual([
        { filename: '*.txt', size: '100' },
        { filename: 'test.*.backup', size: '250' },
      ]);
    });

    it('handles newlines mixed with other special chars in quoted field', async () => {
      const file = createFileMock({
        result: 'id,content\n1,"Line 1: $data\nLine 2: <tag>"',
      });

      await expect(csvToJson(file)).resolves.toEqual([
        { id: '1', content: 'Line 1: $data\nLine 2: <tag>' },
      ]);
    });

    it('handles semicolons in fields when comma is delimiter', async () => {
      const file = createFileMock({
        result: 'list,value\n"a;b;c",1\n"x; y; z",2',
      });

      await expect(csvToJson(file)).resolves.toEqual([
        { list: 'a;b;c', value: '1' },
        { list: 'x; y; z', value: '2' },
      ]);
    });

    it('handles mixed quotes and apostrophes', async () => {
      const file = createFileMock({
        result: "title,author\n\"Don't \"\"Stop\"\" Believin'\",\"It's \"\"Great\"\"\"\"\"\n",
      });

      await expect(csvToJson(file)).resolves.toEqual([
        { title: 'Don\'t "Stop" Believin\'', author: 'It\'s "Great""' },
      ]);
    });

    it('handles consecutive quoted fields with special characters', async () => {
      const file = createFileMock({
        result: 'a,b,c\n"@user","#tag","$money"',
      });

      await expect(csvToJson(file)).resolves.toEqual([
        { a: '@user', b: '#tag', c: '$money' },
      ]);
    });

    it('handles carriage return in quoted field (not as line break)', async () => {
      const file = createFileMock({
        result: 'text,value\n"line1\rline2",123',
      });

      await expect(csvToJson(file)).resolves.toEqual([
        { text: 'line1\rline2', value: '123' },
      ]);
    });

    it('handles leading/trailing whitespace around delimiters preserved', async () => {
      const file = createFileMock({
        result: 'a,b\n  spaced  , more space ',
      });

      await expect(csvToJson(file)).resolves.toEqual([
        { a: '  spaced  ', b: ' more space ' },
      ]);
    });

    it('handles boolean-like values', async () => {
      const file = createFileMock({
        result: 'key,value\ntrue,false\nyes,no\n1,0',
      });

      await expect(csvToJson(file)).resolves.toEqual([
        { key: 'true', value: 'false' },
        { key: 'yes', value: 'no' },
        { key: '1', value: '0' },
      ]);
    });

    it('handles URL-encoded characters and query strings', async () => {
      const file = createFileMock({
        result: 'url,encoded\n"https://example.com?a=1&b=2","name%20value"',
      });

      await expect(csvToJson(file)).resolves.toEqual([
        { url: 'https://example.com?a=1&b=2', encoded: 'name%20value' },
      ]);
    });
  });
});
