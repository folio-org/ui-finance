import { baseManifest } from '@folio/stripes-acq-components';

import { LEDGERS_API } from '../const';

// eslint-disable-next-line import/prefer-default-export
export const ledgersResource = {
  ...baseManifest,
  path: LEDGERS_API,
  records: 'ledgers',
};
