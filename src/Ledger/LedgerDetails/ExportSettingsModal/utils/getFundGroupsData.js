import {
  groupBy,
  keyBy,
} from 'lodash/fp';

import { fetchExportDataByIds } from '@folio/stripes-acq-components';

import { GROUPS_API } from '../../../../common/const';
import { fetchGroupFundFiscalYearsBatch } from '../../../../common/utils';
import { getUniqItems } from './getUniqItems';

const getGroupFundFiscalYears = (ky) => async (fundsMap, fiscalYearId) => {
  const { groupFundFiscalYears } = await fetchGroupFundFiscalYearsBatch(ky)(
    Object.keys(fundsMap),
    { fiscalYearId },
  );

  return groupBy('fundId', groupFundFiscalYears);
};

export const getFundGroupsData = (ky) => async (fundsMap, fiscalYearId) => {
  const groupFundFiscalYearsMap = await getGroupFundFiscalYears(ky)(fundsMap, fiscalYearId);

  const groupIds = getUniqItems(
    groupFundFiscalYearsMap,
    (groupsMap) => groupsMap.map(({ groupId }) => groupId),
  );

  const groups = await fetchExportDataByIds({
    api: GROUPS_API,
    ids: groupIds,
    ky,
    records: 'groups',
  }).then(keyBy('id'));

  return Object.entries(groupFundFiscalYearsMap).reduce(
    (acc, [fundId, groupsMap]) => {
      return {
        ...acc,
        [fundId]: groupsMap.map(({ groupId }) => groups[groupId]),
      };
    },
    {},
  );
};
