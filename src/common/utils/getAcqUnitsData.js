import keyBy from 'lodash/keyBy';

import {
  ACQUISITIONS_UNITS_API,
  fetchExportDataByIds,
} from '@folio/stripes-acq-components';

import { getUniqItems } from './getUniqItems';

export const getAcqUnitsData = (ky) => async (fundsMap) => {
  const acquisitionUnitIds = getUniqItems(
    fundsMap,
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
