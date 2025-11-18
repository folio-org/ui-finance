import { flatten, flow, keyBy, map } from 'lodash/fp';

import { LEDGER_ROLLOVER_API } from '../const';
import { getAcqUnitsData } from './getAcqUnitsData';
import { getFundGroupsData } from './getFundGroupsData';

const joinValues = (dataArray) => {
  return dataArray
    .map(data => (`"${data}"`))
    .join(' | ');
};

export const generateBudgetsReport = ky => async (data) => {
  if (!data.length) return [];

  const rollover = await ky.get(`${LEDGER_ROLLOVER_API}/${data[0].ledgerRolloverId}`).json();

  const fundsMap = flow(
    map(({ fundDetails }) => fundDetails),
    keyBy('id'),
  )(data);

  const [acqUnitsMap, fundGroupsMap] = await Promise.all([
    getAcqUnitsData(ky)(fundsMap),
    getFundGroupsData(ky)(fundsMap, rollover.fromFiscalYearId),
  ]);

  const buildExportRow = (fund = {}, budget = {}, expenseClass = {}) => {
    return {
      // Fund data
      fundName: fund.name,
      fundCode: fund.code,
      fundStatus: fund.fundStatus,
      fundType: fund.fundTypeName,
      fundGroups: joinValues((fundGroupsMap[fund.id] || []).map(({ code }) => code)),
      acqUnits: joinValues(fund.acqUnitIds.map(acqUnitId => acqUnitsMap[acqUnitId]?.name)),
      transferFrom: joinValues(fund.allocatedFromNames),
      transferTo: joinValues(fund.allocatedToNames),
      externalAccountNo: `"${fund.externalAccountNo}"`,
      fundDescription: fund.description,
      // Budget data
      budgetName: budget.name,
      allocatedIncrease: budget.allocationTo,
      allocatedDecrease: budget.allocationFrom,
      totalAllocated: budget.allocated,
      transfers: budget.netTransfers,
      budgetEncumbered: budget.encumbered,
      expended: budget.expenditures,
      overEncumbered: budget.overEncumbrance,
      ...budget,
      // Expense class data,
      expenseClassEncumbered: expenseClass.encumbered,
      expenseClassAwaitingPayment: expenseClass.awaitingPayment,
      expenseClassExpended: expenseClass.expended,
      percentageOfTotalExpended: expenseClass.percentageExpended,
      ...expenseClass,
    };
  };

  const rowsData = data.map(({
    fundDetails,
    expenseClassDetails,
    ...budgetData
  }) => {
    return expenseClassDetails?.length
      ? expenseClassDetails.map(expenseClass => buildExportRow(fundDetails, budgetData, expenseClass))
      : [buildExportRow(fundDetails, budgetData)];
  });

  return flatten(rowsData);
};
