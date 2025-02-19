export const BATCH_ALLOCATION_FIELDS = {
  fundName: 'fundName',
  fundStatus: 'fundStatus',
  budgetName: 'budgetName',
  budgetCurrentAllocation: 'budgetCurrentAllocation',
  budgetStatus: 'budgetStatus',
  budgetAfterAllocation: 'budgetAfterAllocation',
  budgetAllocationChange: 'budgetAllocationChange',
  budgetAllowableEncumbrance: 'budgetAllowableEncumbrance',
  budgetAllowableExpenditure: 'budgetAllowableExpenditure',
  transactionDescription: 'transactionDescription',
  transactionTag: 'transactionTag',
};

export const BATCH_ALLOCATION_COLUMNS = [
  BATCH_ALLOCATION_FIELDS.fundName,
  BATCH_ALLOCATION_FIELDS.fundStatus,
  BATCH_ALLOCATION_FIELDS.budgetName,
  BATCH_ALLOCATION_FIELDS.budgetCurrentAllocation,
  BATCH_ALLOCATION_FIELDS.budgetStatus,
  BATCH_ALLOCATION_FIELDS.budgetAllocationChange,
  BATCH_ALLOCATION_FIELDS.budgetAfterAllocation,
  BATCH_ALLOCATION_FIELDS.budgetAllowableEncumbrance,
  BATCH_ALLOCATION_FIELDS.budgetAllowableExpenditure,
  BATCH_ALLOCATION_FIELDS.transactionDescription,
  BATCH_ALLOCATION_FIELDS.transactionTag,
];

export const BATCH_ALLOCATION_SORTABLE_FIELDS = [
  BATCH_ALLOCATION_FIELDS.fundName,
  BATCH_ALLOCATION_FIELDS.budgetName,
];

export const BATCH_ALLOCATION_FORM_DEFAULT_FIELD_VALUES = {
  [BATCH_ALLOCATION_FIELDS.budgetAllocationChange]: 0,
  [BATCH_ALLOCATION_FIELDS.transactionTag]: {
    tagList: [],
  },
};

export const BATCH_ALLOCATION_FORM_SPECIAL_FIELDS = {
  calculatedFinanceData: 'calculatedFinanceData',
  fyFinanceData: 'fyFinanceData',
  invalidFunds: 'invalidFunds',
  rowIndex: 'rowIndex',
  _isMissed: '_isMissed',
  _isRecalculating: '_isRecalculating',
};

export const BATCH_ALLOCATION_LOG_STATUSES = {
  COMPLETED: 'completed',
  ERROR: 'error',
  IN_PROGRESS: 'inProgress',
};
