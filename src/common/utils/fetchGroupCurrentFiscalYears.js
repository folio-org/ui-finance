import {
  getGroupLedgers,
  getLedgersCurrentFiscalYears,
} from '../../Groups/GroupDetails/utils';

export const fetchGroupCurrentFiscalYears = (httpClient) => async (groupId, options = {}) => {
  const { signal } = options;
  const httpClientExtended = httpClient.extend({ signal });
  const currentFiscalYears = await getGroupLedgers(httpClientExtended)(groupId).then(({ ledgers }) => {
    return getLedgersCurrentFiscalYears(httpClientExtended)(ledgers.map(({ id }) => id));
  });

  return currentFiscalYears;
};
