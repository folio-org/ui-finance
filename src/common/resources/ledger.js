import {
  baseManifest,
  LIMIT_MAX,
} from '@folio/stripes-acq-components';

import { LEDGERS_API } from '../const';

export const ledgersResource = {
  ...baseManifest,
  path: LEDGERS_API,
  params: {
    limit: LIMIT_MAX,
    query: 'cql.allRecords=1 sortby name',
  },
  records: 'ledgers',
};

export const ledgerByUrlIdResource = {
  ...baseManifest,
  path: `${LEDGERS_API}/:{id}`,
};
