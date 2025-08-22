import { BUDGETS_API } from '@folio/stripes-acq-components';

export const getBudgetByFundAndFY = (httpClient, signal) => (transactionFundId, fiscalYearId) => {
  const searchParams = {
    query: `fundId==${transactionFundId} and fiscalYearId==${fiscalYearId}`,
    limit: 1,
  };

  return httpClient.get(BUDGETS_API, { searchParams, signal }).json();
};
