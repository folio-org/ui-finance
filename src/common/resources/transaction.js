import { baseManifest } from '@folio/stripes-acq-components';

import {
  RELEASE_ENCUMBRANCE_API,
  TRANSACTIONS_API,
} from '../const';

export const transactionByUrlIdResource = {
  ...baseManifest,
  path: `${TRANSACTIONS_API}/:{id}`,
};

export const releaseEncumbranceResource = {
  ...baseManifest,
  accumulate: true,
  fetch: false,
  POST: {
    path: RELEASE_ENCUMBRANCE_API,
  },
};
