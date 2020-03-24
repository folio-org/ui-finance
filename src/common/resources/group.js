import { baseManifest } from '@folio/stripes-acq-components';

import { GROUPS_API } from '../const';

export const groupsResource = {
  ...baseManifest,
  path: GROUPS_API,
  params: {
    query: 'cql.allRecords=1 sortby name',
  },
  records: 'groups',
};

export const groupByUrlIdResource = {
  ...baseManifest,
  path: `${GROUPS_API}/:{id}`,
};
