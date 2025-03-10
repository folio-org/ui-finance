import {
  getGroupLedgers,
  getLedgersCurrentFiscalYears,
} from '../../Groups/GroupDetails/utils';
import { fetchGroupCurrentFiscalYears } from './fetchGroupCurrentFiscalYears';

jest.mock('../../Groups/GroupDetails/utils', () => ({
  ...jest.requireActual('../../Groups/GroupDetails/utils'),
  getGroupLedgers: jest.fn(),
  getLedgersCurrentFiscalYears: jest.fn(),
}));

const httpClient = {
  extend: jest.fn(() => httpClient),
  get: jest.fn(() => ({
    json: jest.fn(() => Promise.resolve({})),
  })),
};

const fiscalYear = {
  id: 'fiscalYearId',
  series: 'series',
};

describe('fetchGroupCurrentFiscalYears', () => {
  beforeEach(() => {
    getGroupLedgers.mockReturnValue(() => Promise.resolve({ ledgers: [{ id: 'ledgerId' }] }));
    getLedgersCurrentFiscalYears.mockReturnValue(() => Promise.resolve([fiscalYear]));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch current fiscal years for the group', async () => {
    const res = await fetchGroupCurrentFiscalYears(httpClient)('groupId');

    expect(getGroupLedgers).toHaveBeenCalled();
    expect(getLedgersCurrentFiscalYears).toHaveBeenCalled();
    expect(res).toEqual([fiscalYear]);
  });
});
