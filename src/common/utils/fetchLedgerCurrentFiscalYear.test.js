import { LEDGERS_API } from '../const';
import { fetchLedgerCurrentFiscalYear } from './fetchLedgerCurrentFiscalYear';

const httpClient = {
  get: jest.fn(() => ({
    json: jest.fn(() => Promise.resolve({})),
  })),
};

describe('fetchFinanceData', () => {
  it('should fetch finance data by specific query', async () => {
    const ledgerId = 'ledgerId';
    const options = {};

    await fetchLedgerCurrentFiscalYear(httpClient)(ledgerId, options);

    expect(httpClient.get).toHaveBeenCalledWith(`${LEDGERS_API}/${ledgerId}/current-fiscal-year`, options);
  });
});
