import {
  difference,
  keyBy,
} from 'lodash/fp';

import {
  fetchExportDataByIds,
  FUNDS_API,
} from '@folio/stripes-acq-components';

import { getUniqItems } from '../../../../common/utils';

export const getAllocatableFunds = (ky) => async (ledgerFundsMap) => {
  const ledgerFundIds = Object.keys(ledgerFundsMap);

  const allocatableFundIds = getUniqItems(
    ledgerFundsMap,
    ({ allocatedFromIds, allocatedToIds }) => [...allocatedFromIds, ...allocatedToIds],
  );

  const allocatableFundIdsToFetch = difference(allocatableFundIds, ledgerFundIds);

  const fetchedFunds = await fetchExportDataByIds({
    api: FUNDS_API,
    ids: allocatableFundIdsToFetch,
    ky,
    records: 'funds',
  }).then(keyBy('id'));

  return allocatableFundIds.reduce((acc, allocatableFundId) => {
    return {
      ...acc,
      [allocatableFundId]: fetchedFunds[allocatableFundId] || ledgerFundsMap[allocatableFundId],
    };
  }, {});
};
