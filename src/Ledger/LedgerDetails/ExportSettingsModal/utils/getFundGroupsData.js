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

const getGroupFundFiscalYears = (ky) => async ({ funds, fiscalYearId }) => {
  const groupFundFiscalYears = await fetchExportDataByIds({
    api: GROUP_FUND_FISCAL_YEARS_API,
    buildQuery: buildQueryByFundIds(fiscalYearId),
    ids: Object.keys(funds),
    ky,
    records: 'groupFundFiscalYears',
  });

  return groupBy('fundId', groupFundFiscalYears);
};

export const getFundGroupsData = (ky) => async ({ funds, fiscalYearId }) => {
  const groupFundFiscalYears = await getGroupFundFiscalYears(ky)({ funds, fiscalYearId });

  const groupIds = getUniqItems(
    groupFundFiscalYears,
    (groupsMap) => groupsMap.map(({ groupId }) => groupId),
  );

  const groups = await fetchExportDataByIds({
    api: GROUPS_API,
    ids: groupIds,
    ky,
    records: 'groups',
  }).then(keyBy('id'));

  const fundGroups = Object.entries(groupFundFiscalYears).reduce(
    (acc, [fundId, groupsMap]) => {
      return {
        ...acc,
        [fundId]: groupsMap.map(({ groupId }) => groups[groupId]),
      };
    },
    {},
  );

  return fundGroups;
};
