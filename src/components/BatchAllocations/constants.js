export const BATCH_ALLOCATION_COLUMNS = [
  'fundName',
  'fundStatus',
  'budgetName',
  // 'totalAllocatedBefore',
  'budgetStatus',
  // 'allocationIncreaseDecrease',
  // 'totalAllocatedAfter',
  'budgetAllowableEncumbrance',
  'budgetAllowableExpenditure',
  // 'transactionDescription',
  // 'fundTags',
];

export const BATCH_ALLOCATION_SORTABLE_FIELDS = [
  BATCH_ALLOCATION_COLUMNS.fundName,
  BATCH_ALLOCATION_COLUMNS.budgetName,
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
