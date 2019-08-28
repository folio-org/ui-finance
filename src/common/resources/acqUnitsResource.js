import { baseManifest } from '@folio/stripes-acq-components';

import { ACQUISITIONS_UNITS_API } from '../const';

// eslint-disable-next-line import/prefer-default-export
export const acqUnitsResource = {
  ...baseManifest,
  path: ACQUISITIONS_UNITS_API,
  records: 'acquisitionsUnits',
};
