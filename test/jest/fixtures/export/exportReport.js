import { budgetsData } from './budgetsData';
import { expenseClassesData } from './expenseClassesData';
import { fundsData } from './fundsData';

const budgetData = budgetsData['012e7da4-003c-48ff-9feb-f3745044da35'];
const expenseClassData = expenseClassesData['012e7da4-003c-48ff-9feb-f3745044da35'];
const fundData = fundsData[budgetData.fundId];

export const exportReport = [{
  // fund fields
  fundName: fundData.name,
  fundCode: fundData.code,
  fundStatus: fundData.fundStatus,
  fundType: fundData.fundType?.name,
  fundGroups: '"HIST" | "ACADEMIC"',
  acqUnits: '',
  transferFrom: '',
  transferTo: '',
  externalAccountNo: `"${fundData.externalAccountNo}"`,
  fundDescription: fundData.description,

  // budget fields
  budgetName: budgetData.name,
  budgetStatus: budgetData.budgetStatus,
  allowableEncumbrance: budgetData.allowableEncumbrance,
  allowableExpenditure: budgetData.allowableExpenditure,
  createdDate: budgetData.metadata.createdDate,
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
  overEncumbered: budgetData.overEncumbrance,
  overExpended: budgetData.overExpended,
  cashBalance: budgetData.cashBalance,
  credited: budgetData.credits,
  available: budgetData.available,

  // expense class fields
  expenseClassName: expenseClassData.name,
  expenseClassCode: expenseClassData.code,
  expenseClassStatus: expenseClassData[0].expenseClassStatus,
  expenseClassEncumbered: expenseClassData.encumbered,
  expenseClassAwaitingPayment: expenseClassData.awaitingPayment,
  expenseClassExpended: expenseClassData.expended,
  percentageOfTotalExpended: expenseClassData.percentageExpended,
}];
