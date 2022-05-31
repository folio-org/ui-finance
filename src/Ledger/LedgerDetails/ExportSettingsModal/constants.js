export const EXPORT_EXPENSE_CLASSES_VALUES = {
  all: 'all',
  active: 'active',
  inactive: 'inactive',
  none: 'none',
};

export const EXPORT_EXPENSE_CLASS_STATUSES_MAP = {
  [EXPORT_EXPENSE_CLASSES_VALUES.all]: ['Active', 'Inactive'],
  [EXPORT_EXPENSE_CLASSES_VALUES.active]: ['Active'],
  [EXPORT_EXPENSE_CLASSES_VALUES.inactive]: ['Inactive'],
  [EXPORT_EXPENSE_CLASSES_VALUES.none]: null,
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
  percentageOfTotalExpended: 'Percentage of total expended',
};
