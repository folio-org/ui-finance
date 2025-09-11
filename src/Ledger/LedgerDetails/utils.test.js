import { getLedgerGroupsSummary } from './utils';

const ky = {
  get: jest.fn(() => ({
    json: () => Promise.resolve({ groupFiscalYearSummaries: [] }),
  })),
};

describe('getLedgerGroupsSummary', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call API', () => {
    getLedgerGroupsSummary(ky, 'groupId', 'fiscalYearId');

    expect(ky.get).toHaveBeenCalled();
  });

  it('should not call API', () => {
    getLedgerGroupsSummary(ky, 'groupId');

    expect(ky.get).not.toHaveBeenCalled();
  });
});
