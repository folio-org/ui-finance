import { baseManifest } from '@folio/stripes-acq-components';

import {
  FUNDS_API,
  FUND_TYPES_API,
} from '../const';

export const fundResource = {
  ...baseManifest,
  path: `${FUNDS_API}/:{id}`,
};

export const fundTypesResource = {
  ...baseManifest,
  path: FUND_TYPES_API,
  records: 'fundTypes',
};

export const fundsResource = {
  ...baseManifest,
  path: FUNDS_API,
  records: 'funds',
};
