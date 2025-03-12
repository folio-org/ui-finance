import {
  fetchGroupCurrentFiscalYears,
  fetchLedgerCurrentFiscalYear,
} from '../../common/utils';
import { fetchSourceCurrentFiscalYears } from './utils';

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
