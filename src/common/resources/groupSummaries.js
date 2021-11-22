import {
  baseManifest,
} from '@folio/stripes-acq-components';

import {
  GROUP_SUMMARIES_API,
} from '../const';

export const groupSummariesResource = {
  ...baseManifest,
  path: GROUP_SUMMARIES_API,
  records: 'groupFiscalYearSummaries',
  accumulate: true,
  fetch: false,
};
