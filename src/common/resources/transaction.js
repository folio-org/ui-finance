import { baseManifest } from '@folio/stripes-acq-components';

import { TRANSACTIONS_API } from '../const';

export const transactionsResource = {
  ...baseManifest,
  path: TRANSACTIONS_API,
  records: 'transactions',
};

export const transactionByUrlIdResource = {
  ...baseManifest,
  path: `${TRANSACTIONS_API}/:{id}`,
};
