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
});
