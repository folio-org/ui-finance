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

export const EXPORT_DATA_FIELDS = {
  // Fund fields
  fundName: 'Fund name',
  fundCode: 'Fund code',
  fundStatus: 'Fund status',
  fundType: 'Type',
  fundGroups: 'Group',
  acqUnits: 'Acquisition unit',
  transferFrom: 'Transfer from',
  transferTo: 'Transfer to',
  externalAccountNo: 'External account number',
  fundDescription: 'Description',

  // Budget fields
  budgetName: 'Budget name',
  budgetStatus: 'Budget status',
  allowableEncumbrance: 'Allowable encumbrance',
  allowableExpenditure: 'Allowable expenditure',
  createdDate: 'Date created',
  initialAllocation: 'Initial allocation',
  allocatedIncrease: 'Increase',
  allocatedDecrease: 'Decrease',
  totalAllocated: 'Total allocation',
  transfers: 'Transfers',
  totalFunding: 'Total Funding',
  budgetEncumbered: 'Encumbered on budget',
  awaitingPayment: 'Awaiting payment (budget)',
  expended: 'Expended (budget)',
  unavailable: 'Unavailable',
  overEncumbered: 'Over encumbered',
  overExpended: 'Over expended',
  cashBalance: 'Cash balance',
  available: 'Available',

  // Expense class fields
  expenseClassName: 'Expense class name',
  expenseClassCode: 'Expense class code',
  expenseClassStatus: 'Expense class status',
  expenseClassEncumbered: 'Encumbered for expense class',
  expenseClassAwaitingPayment: 'Awaiting payment',
  expenseClassExpended: 'Expended',
  percentageOfTotalExpended: 'Percentage of total expended',
};
