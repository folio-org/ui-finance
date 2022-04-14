import { keyBy } from 'lodash';

import {
  fetchAllRecords,
  FUNDS_API,
} from '@folio/stripes-acq-components';

import { getAcqUnitsData } from './getAcqUnitsData';
import { getFundTypesData } from './getFundTypesData';
import { getFundGroupsData } from './getFundGroupsData';
import { getAllocatableFunds } from './getAllocatableFunds';

const getAllLedgerFunds = (ky) => async (ledger) => {
  const funds = await fetchAllRecords(
    {
      GET: async ({ params: searchParams }) => {
        const { funds: fundsResponse } = await ky.get(FUNDS_API, { searchParams }).json();

        return fundsResponse;
      },
    },
    `ledgerId==${ledger.id}`,
  );

  return keyBy(funds, 'id');
};

const getFundsRelatedData = (ky) => async (fundsMap, fiscalYearId) => {
  const [
    acqUnitsMap,
    allocatableFundsMap,
    fundGroupsMap,
    fundTypesMap,
  ] = await Promise.all([
    getAcqUnitsData(ky)(fundsMap),
    getAllocatableFunds(ky)(fundsMap),
    getFundGroupsData(ky)(fundsMap, fiscalYearId),
    getFundTypesData(ky)(fundsMap),
  ]);

  return {
    acqUnitsMap,
    allocatableFundsMap,
    fundGroupsMap,
    fundTypesMap,
  };
};

export const getFundsExportData = (ky) => async ({ ledger, fiscalYearId }) => {
  const fundsMap = await getAllLedgerFunds(ky)(ledger);
  const {
    acqUnitsMap,
    allocatableFundsMap,
    fundGroupsMap,
    fundTypesMap,
  } = await getFundsRelatedData(ky)(fundsMap, fiscalYearId);

  return Object.entries(fundsMap).reduce((acc, [fundId, data]) => {
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
