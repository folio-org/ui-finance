import {
  flatten,
  flow,
  map,
} from 'lodash/fp';

import { formatDateTime } from '@folio/stripes-acq-components';

export const createExportReport = async (
  {
    budgetsData,
    expenseClassesData,
    fundsData,
  },
  {
    intl,
  },
) => {
  const joinFields = (dataArray, field = 'code') => {
    return dataArray
      .map(data => (data?.[field] ? `"${data[field]}"` : null))
      .filter(Boolean)
      .join(' | ');
  };

  const getFundFields = (fundData) => ({
    fundName: fundData.name,
    fundCode: fundData.code,
    fundStatus: fundData.fundStatus,
    fundType: fundData.fundType?.name,
    fundGroups: joinFields(fundData.fundGroups),
    acqUnits: joinFields(fundData.acqUnits, 'name'),
    transferFrom: joinFields(fundData.transferFrom),
    transferTo: joinFields(fundData.transferTo),
    externalAccountNo: `"${fundData.externalAccountNo}"`,
    fundDescription: fundData.description,
  });

  const getBudgetFields = (budgetData = {}) => ({
    budgetName: budgetData.name || intl.formatMessage({ id: 'ui-finance.exportCSV.report.budget.notFound' }),
    budgetStatus: budgetData.budgetStatus,
    allowableEncumbrance: budgetData.allowableEncumbrance,
    allowableExpenditure: budgetData.allowableExpenditure,
    createdDate: formatDateTime(budgetData.metadata?.createdDate, intl),
    initialAllocation: budgetData.initialAllocation,
    allocatedIncrease: budgetData.allocationTo,
    allocatedDecrease: budgetData.allocationFrom,
    totalAllocated: budgetData.allocated,
    transfers: budgetData.netTransfers,
    totalFunding: budgetData.totalFunding,
    budgetEncumbered: budgetData.encumbered,
    awaitingPayment: budgetData.awaitingPayment,
    expended: budgetData.expenditures,
    unavailable: budgetData.unavailable,
    credited: budgetData.credits,
    overEncumbered: budgetData.overEncumbrance,
    overExpended: budgetData.overExpended,
    cashBalance: budgetData.cashBalance,
    available: budgetData.available,
  });

  const getExpenseClassFields = (expenseClassData = {}) => ({
    expenseClassName: expenseClassData.name,
    expenseClassCode: expenseClassData.code,
    expenseClassStatus: expenseClassData.expenseClassStatus,
    expenseClassEncumbered: expenseClassData.encumbered,
    expenseClassAwaitingPayment: expenseClassData.awaitingPayment,
    expenseClassExpended: expenseClassData.expended,
    percentageOfTotalExpended: expenseClassData.percentageExpended,
  });

  const getExportRow = ({
    budget,
    expenseClass,
    fund,
  }) => ({
    ...getFundFields(fund),
    ...getBudgetFields(budget),
    ...getExpenseClassFields(expenseClass),
  });

  const buildExportRows = ([fundId, fund]) => {
    const budget = Object.values(budgetsData).find(data => data.fundId === fundId);
    const expenseClasses = expenseClassesData[budget?.id] || [];

    return expenseClasses.length
      ? expenseClasses.map(expenseClass => getExportRow({ fund, budget, expenseClass }))
      : [getExportRow({ fund, budget })];
  };

  return flow(
    map(buildExportRows),
    flatten,
  )(Object.entries(fundsData));
};
