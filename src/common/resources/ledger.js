import { baseManifest } from '@folio/stripes-acq-components';

import { LEDGERS_API } from '../const';

export const ledgersResource = {
  ...baseManifest,
  path: LEDGERS_API,
  records: 'ledgers',
};

export const ledgerByUrlIdResource = {
  ...baseManifest,
  path: `${LEDGERS_API}/:{id}`,
};
