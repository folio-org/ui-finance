export const CHUNK_LIMIT = 25;
export const NO_ID = 'noId';

export const CREATE_UNITS_PERM = 'finance.acquisitions-units-assignments.assign';
export const MANAGE_UNITS_PERM = 'finance.acquisitions-units-assignments.manage';

export const OVERALL_ROLLOVER_STATUS = {
  inProgress: 'In Progress',
  success: 'Success',
  error: 'Error',
  notStarted: 'Not Started',
};

export const ENCUMBRANCE_STATUS = {
  released: 'Released',
  unreleased: 'Unreleased',
};

export const LEDGER_ROLLOVER_TYPES = {
  commit: 'Commit',
  preview: 'Preview',
  rollback: 'Rollback',
};

export const EXPORT_FUND_FIELDS = {
  fundName: 'Name (Fund)',
  fundCode: 'Code (Fund)',
  fundStatus: 'Status (Fund)',
  fundType: 'Type',
  fundGroups: 'Group (Code)',
  acqUnits: 'Acquisition unit',
  transferFrom: 'Transfer from',
  transferTo: 'Transfer to',
  externalAccountNo: 'External account number',
  fundDescription: 'Description',
};

export const EXPORT_BUDGET_FIELDS = {
  budgetName: 'Name (Budget)',
  budgetStatus: 'Status (Budget)',
  allowableEncumbrance: 'Allowable encumbrance',
  allowableExpenditure: 'Allowable expenditure',
  createdDate: 'Date created (Budget)',
  initialAllocation: 'Initial allocation',
  allocatedIncrease: 'Increase',
  allocatedDecrease: 'Decrease',
  totalAllocated: 'Total allocation',
  transfers: 'Transfers',
  totalFunding: 'Total Funding',
  budgetEncumbered: 'Encumbered (Budget)',
  awaitingPayment: 'Awaiting payment (Budget)',
  expended: 'Expended (Budget)',
  credited: 'Credited (Budget)',
  unavailable: 'Unavailable',
  overEncumbered: 'Over encumbered',
  overExpended: 'Over expended',
  cashBalance: 'Cash balance',
  available: 'Available',
};

export const EXPORT_EXPENSE_CLASS_FIELDS = {
  expenseClassName: 'Name (Exp Class)',
  expenseClassCode: 'Code (Exp Class)',
  expenseClassStatus: 'Status (Exp Class)',
  expenseClassEncumbered: 'Encumbered (Exp Class)',
  expenseClassAwaitingPayment: 'Awaiting payment (Exp Class)',
  expenseClassExpended: 'Expended (Exp Class)',
  expenseCredited: 'Credited (Exp Class)',
  percentageOfTotalExpended: 'Percentage of total expended',
};

export const BATCH_TRANSACTION_TYPES = {
  transactionsToCreate: 'transactionsToCreate',
  transactionsToUpdate: 'transactionsToUpdate',
  idsOfTransactionsToDelete: 'idsOfTransactionsToDelete',
  transactionPatches: 'transactionPatches',
};

export const EXPORT_ALLOCATION_WORKSHEET_FIELDS = {
  fiscalYear: 'Fiscal year',
  fundName: 'Fund name',
  fundCode: 'Fund code',
  fundId: 'Fund UUID',
  fundStatus: 'Fund status',
  budgetName: 'Budget name',
  budgetId: 'Budget UUID',
  budgetStatus: 'Budget status',
  budgetInitialAllocation: 'Budget initial allocation',
  budgetCurrentAllocation: 'Budget current allocation',
  budgetAllowableExpenditure: 'Budget allowable expenditure',
  budgetAllowableEncumbrance: 'Budget allowable encumbrance',
  allocationAdjustment: 'Allocation adjustment',
  transactionTag: 'Transaction tag',
  transactionDescription: 'Transaction description',
};
