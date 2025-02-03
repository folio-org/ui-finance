export const BATCH_ALLOCATION_FIELDS = {
  fundName: 'fundName',
  fundStatus: 'fundStatus',
  budgetName: 'budgetName',
  budgetInitialAllocation: 'budgetInitialAllocation',
  budgetStatus: 'budgetStatus',
  allocationIncreaseDecrease: 'allocationIncreaseDecrease',
  totalAllocatedAfter: 'totalAllocatedAfter',
  budgetAllowableEncumbrance: 'budgetAllowableEncumbrance',
  budgetAllowableExpenditure: 'budgetAllowableExpenditure',
  transactionDescription: 'transactionDescription',
  fundTags: 'fundTags',
};

export const BATCH_ALLOCATION_COLUMNS = [
  BATCH_ALLOCATION_FIELDS.fundName,
  BATCH_ALLOCATION_FIELDS.fundStatus,
  BATCH_ALLOCATION_FIELDS.budgetName,
  BATCH_ALLOCATION_FIELDS.budgetInitialAllocation,
  BATCH_ALLOCATION_FIELDS.budgetStatus,
  BATCH_ALLOCATION_FIELDS.allocationIncreaseDecrease,
  BATCH_ALLOCATION_FIELDS.totalAllocatedAfter,
  BATCH_ALLOCATION_FIELDS.budgetAllowableEncumbrance,
  BATCH_ALLOCATION_FIELDS.budgetAllowableExpenditure,
  BATCH_ALLOCATION_FIELDS.transactionDescription,
  BATCH_ALLOCATION_FIELDS.fundTags,
];

export const BATCH_ALLOCATION_SORTABLE_FIELDS = [
  BATCH_ALLOCATION_FIELDS.fundName,
  BATCH_ALLOCATION_FIELDS.budgetName,
];

export const BARCH_ALLOCATION_STATUS = {
  active: 'Active',
  frozen: 'Frozen',
  inactive: 'Inactive',
};

export const BARCH_ALLOCATION_STATUS_LABEL_ID = {
  [BARCH_ALLOCATION_STATUS.active]: 'ui-finance.allocation.batch.status.active',
  [BARCH_ALLOCATION_STATUS.frozen]: 'ui-finance.allocation.batch.status.frozen',
  [BARCH_ALLOCATION_STATUS.inactive]: 'ui-finance.allocation.batch.status.inactive',
};

export const BARCH_ALLOCATION_STATUS_OPTIONS = Object.values(BARCH_ALLOCATION_STATUS).map(status => ({
  labelId: BARCH_ALLOCATION_STATUS_LABEL_ID[status],
  value: status,
}));
