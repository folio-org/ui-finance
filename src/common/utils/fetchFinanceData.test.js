import { FINANCE_DATA_API } from '../const';
import { fetchFinanceData } from './fetchFinanceData';

const httpClient = {
  get: jest.fn(() => ({
    json: jest.fn(() => Promise.resolve({})),
  })),
};

describe('fetchFinanceData', () => {
  it('should fetch finance data by specific query', async () => {
    const fetcher = fetchFinanceData(httpClient);
    const options = { query: 'financeDataQuery' };

    await fetcher(options);

    expect(httpClient.get).toHaveBeenCalledWith(FINANCE_DATA_API, options);
  });
});
