import { keyBy } from 'lodash';

import {
  FUNDS_API,
  LIMIT_MAX,
} from '@folio/stripes-acq-components';

import { getAcqUnitsData } from './getAcqUnitsData';
import { getFundTypesData } from './getFundTypesData';
import { getFundGroupsData } from './getFundGroupsData';
import { getAllocatableFunds } from './getAllocatableFunds';

const getAllLedgerFunds = (ky) => async (ledger) => {
  const fetchFunds = async (offset = 0, acc = []) => {
    const { funds: fundsChunk = [] } = await ky.get(FUNDS_API, {
      searchParams: {
        offset,
        limit: LIMIT_MAX,
        query: `ledgerId==${ledger.id}`,
      },
    })
      .json();

    return fundsChunk.length
      ? fetchFunds(offset + LIMIT_MAX, [...acc, ...fundsChunk])
      : [...acc, ...fundsChunk];
  };

  const funds = await fetchFunds();

  return keyBy(funds, 'id');
};

const getFundsRelatedData = (ky) => async ({ funds, fiscalYearId }) => {
  const [
    acqUnitsMap,
    allocatableFundsMap,
    fundGroupsMap,
    fundTypesMap,
  ] = await Promise.all([
    getAcqUnitsData(ky)(funds),
    getAllocatableFunds(ky)(funds),
    getFundGroupsData(ky)({ funds, fiscalYearId }),
    getFundTypesData(ky)(funds),
  ]);

  return {
    acqUnitsMap,
    allocatableFundsMap,
    fundGroupsMap,
    fundTypesMap,
  };
};

export const getFundsExportData = (ky) => async ({ ledger, fiscalYearId }) => {
  const funds = await getAllLedgerFunds(ky)(ledger);
  const {
    acqUnitsMap,
    allocatableFundsMap,
    fundGroupsMap,
    fundTypesMap,
  } = await getFundsRelatedData(ky)({ funds, fiscalYearId });

  return Object.entries(funds).reduce((acc, [fundId, data]) => {
    return {
      ...acc,
      [fundId]: {
        ...data,
        acqUnits: data.acqUnitIds.map(acqUnitId => acqUnitsMap[acqUnitId]),
        fundGroups: fundGroupsMap[fundId] || [],
        fundType: fundTypesMap[data.fundTypeId],
        transferFrom: data.allocatedFromIds.map(allocFundId => allocatableFundsMap[allocFundId]),
        transferTo: data.allocatedToIds.map(allocFundId => allocatableFundsMap[allocFundId]),
      },
    };
  }, {});
};
