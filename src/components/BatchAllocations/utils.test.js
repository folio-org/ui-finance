import {
  fetchGroupCurrentFiscalYears,
  fetchLedgerCurrentFiscalYear,
} from '../../common/utils';
import {
  fetchSourceCurrentFiscalYears,
  parseEmptyAsUndefined,
  parseNumberOrInitial,
} from './utils';

jest.mock('../../common/utils', () => ({
  ...jest.requireActual('../../common/utils'),
  fetchGroupCurrentFiscalYears: jest.fn(),
  fetchLedgerCurrentFiscalYear: jest.fn(),
}));

describe('fetchSourceCurrentFiscalYears', () => {
  const fetchGroupCurrentFiscalYearsMock = jest.fn(() => ([]));
  const fetchLedgerCurrentFiscalYearMock = jest.fn(() => ([]));

  beforeEach(() => {
    fetchGroupCurrentFiscalYears.mockReturnValue(fetchGroupCurrentFiscalYearsMock);
    fetchLedgerCurrentFiscalYear.mockReturnValue(fetchLedgerCurrentFiscalYearMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call fetchGroupCurrentFiscalYears with correct params', async () => {
    const httpClient = {};
    const sourceType = 'group';
    const sourceId = 'sourceId';
    const options = {};

    await fetchSourceCurrentFiscalYears(httpClient)(sourceType, sourceId, options);

    expect(fetchGroupCurrentFiscalYearsMock).toHaveBeenCalledWith(sourceId, options);
  });

  it('should call fetchLedgerCurrentFiscalYear with correct params', async () => {
    const httpClient = {};
    const sourceType = 'ledger';
    const sourceId = 'sourceId';
    const options = {};

    await fetchSourceCurrentFiscalYears(httpClient)(sourceType, sourceId, options);

    expect(fetchLedgerCurrentFiscalYearMock).toHaveBeenCalledWith(sourceId, options);
  });
});

describe('parseEmptyAsUndefined', () => {
  it('returns undefined for empty string', () => {
    expect(parseEmptyAsUndefined('')).toBeUndefined();
  });

  it('returns value unchanged for non-empty string', () => {
    expect(parseEmptyAsUndefined('abc')).toBe('abc');
  });

  it('returns undefined for undefined input', () => {
    expect(parseEmptyAsUndefined(undefined)).toBeUndefined();
  });
});

describe('parseNumberOrInitial', () => {
  it('parses numeric string to number', () => {
    expect(parseNumberOrInitial('10')).toBe(10);
  });

  it('returns original value for non-numeric string', () => {
    expect(parseNumberOrInitial('abc')).toBe('abc');
  });
});
