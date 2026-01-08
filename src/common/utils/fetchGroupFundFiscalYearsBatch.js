import { GROUP_FUND_FISCAL_YEARS_BATCH_API } from '../const';

export const fetchGroupFundFiscalYearsBatch = (httpClient) => (fundIds, filters = {}, options = {}) => {
  const { fiscalYearId, groupId } = filters;

  const dto = {
    fiscalYearId,
    fundIds,
    groupId,
  };

  return httpClient.post(GROUP_FUND_FISCAL_YEARS_BATCH_API, { json: dto, ...options }).json();
};
