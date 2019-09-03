import { baseManifest } from '@folio/stripes-acq-components';

import { FISCAL_YEARS_API } from '../const';

// eslint-disable-next-line import/prefer-default-export
export const fiscalYearsResource = {
  ...baseManifest,
  path: FISCAL_YEARS_API,
  records: 'fiscalYears',
};

export const fiscalYearResource = {
  ...baseManifest,
  path: `${FISCAL_YEARS_API}/:{id}`
};
