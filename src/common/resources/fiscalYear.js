import { get } from 'lodash';

import { baseManifest } from '@folio/stripes-acq-components';

import { FISCAL_YEARS_API } from '../const';

export const fiscalYearsResource = {
  ...baseManifest,
  path: FISCAL_YEARS_API,
  records: 'fiscalYears',
};

export const fiscalYearByIdResource = {
  ...baseManifest,
  path: (queryParams, pathComponents, resourceData, logger, props) => {
    const fiscalYearId = get(props, ['resources', 'budget', 'records', 0, 'fiscalYearId']);

    return fiscalYearId ? `${FISCAL_YEARS_API}/${fiscalYearId}` : null;
  },
};
