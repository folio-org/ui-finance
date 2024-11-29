import { FINANCE_DATA_API } from '../const';

export const fetchFinanceData = (httpClient) => (options) => {
  return httpClient.get(FINANCE_DATA_API, options).json();
};
