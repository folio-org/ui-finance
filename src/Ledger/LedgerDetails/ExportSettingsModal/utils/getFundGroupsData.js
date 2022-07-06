import {
  groupBy,
  keyBy,
} from 'lodash/fp';

import { fetchExportDataByIds } from '@folio/stripes-acq-components';

import {
  GROUPS_API,
  GROUP_FUND_FISCAL_YEARS_API,
} from '../../../../common/const';
import { getUniqItems } from './getUniqItems';

const buildQueryByFundIds = (fiscalYearId) => (itemsChunk) => {
  const query = itemsChunk
    .map(fundId => `fundId==${fundId}`)
    .join(' or ');

  return [
    `fiscalYearId==${fiscalYearId}`,
    query,
  ]
    .filter(Boolean)
    .map(value => `(${value})`)
    .join(' and ');
};

const getGroupFundFiscalYears = (ky) => async (fundsMap, fiscalYearId) => {
  const groupFundFiscalYears = await fetchExportDataByIds({
    api: GROUP_FUND_FISCAL_YEARS_API,
    buildQuery: buildQueryByFundIds(fiscalYearId),
    ids: Object.keys(fundsMap),
    ky,
    records: 'groupFundFiscalYears',
  });

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
