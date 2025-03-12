import { LEDGERS_API } from '../const';

export const fetchLedgerCurrentFiscalYear = (httpClient) => async (ledgerId, options) => {
  return httpClient.get(`${LEDGERS_API}/${ledgerId}/current-fiscal-year`, options).json();
};
