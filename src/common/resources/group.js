import { baseManifest } from '@folio/stripes-acq-components';

import { GROUPS_API } from '../const';

// eslint-disable-next-line import/prefer-default-export
export const groupsResource = {
  ...baseManifest,
  path: GROUPS_API,
  records: 'groups',
};
