import { baseManifest } from '@folio/stripes-acq-components';

import {
  ALLOCATIONS_API,
  ENCUMBRANCES_API,
  TRANSACTIONS_API,
  TRANSFERS_API,
} from '../const';

export const transactionResource = {
  ...baseManifest,
  path: `${TRANSACTIONS_API}/:{id}`,
  POST: {
    path: TRANSACTIONS_API,
  },
};

export const transactionsResource = {
  ...baseManifest,
  path: TRANSACTIONS_API,
  records: 'transactions',
};

export const transactionByUrlIdResource = {
  ...baseManifest,
  path: `${TRANSACTIONS_API}/:{id}`,
};

export const allocationsResource = {
  ...baseManifest,
  accumulate: true,
  fetch: false,
  path: ALLOCATIONS_API,
  records: 'transactions',
};

export const encumbrancesResource = {
  ...baseManifest,
  accumulate: true,
  fetch: false,
  path: ENCUMBRANCES_API,
  records: 'transactions',
};

export const transfersResource = {
  ...baseManifest,
  accumulate: true,
  fetch: false,
  path: TRANSFERS_API,
  records: 'transactions',
};
