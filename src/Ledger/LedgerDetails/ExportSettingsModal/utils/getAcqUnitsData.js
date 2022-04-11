import { keyBy } from 'lodash';

import {
  ACQUISITIONS_UNITS_API,
  fetchExportDataByIds,
} from '@folio/stripes-acq-components';

import { getUniqItems } from './getUniqItems';

export const getAcqUnitsData = (ky) => async (funds) => {
  const acquisitionUnitIds = getUniqItems(
    funds,
    ({ acqUnitIds }) => acqUnitIds,
  );

  const acqUnits = await fetchExportDataByIds({
    api: ACQUISITIONS_UNITS_API,
    ids: acquisitionUnitIds,
    ky,
    records: 'acquisitionsUnits',
  });

  return keyBy(acqUnits, 'id');
};
