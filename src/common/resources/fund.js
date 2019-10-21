import {
  baseManifest,
  FUNDS_API,
  fundsManifest,
} from '@folio/stripes-acq-components';

import {
  FUND_TYPES_API,
} from '../const';

export const fundResource = {
  ...baseManifest,
  path: `${FUNDS_API}/:{id}`,
};

export const fundTypesResource = {
  ...baseManifest,
  path: FUND_TYPES_API,
  params: {
    query: 'cql.allRecords=1 sortby name',
  },
  records: 'fundTypes',
};

export const fundsResource = fundsManifest;
