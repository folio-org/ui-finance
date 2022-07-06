import { keyBy } from 'lodash';

import { fetchExportDataByIds } from '@folio/stripes-acq-components';

import { FUND_TYPES_API } from '../../../../common/const';
import { getUniqItems } from './getUniqItems';

export const getFundTypesData = (ky) => async (fundsMap) => {
  const fundTypeIds = getUniqItems(
    fundsMap,
    ({ fundTypeId }) => fundTypeId,
  );

  const fundTypes = await fetchExportDataByIds({
    api: FUND_TYPES_API,
    ids: fundTypeIds,
    ky,
    records: 'fundTypes',
  });

  return keyBy(fundTypes, 'id');
};
