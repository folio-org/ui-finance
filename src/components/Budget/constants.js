export const BUDGET_STATUSES = {
  ACTIVE: 'Active',
  CLOSED: 'Closed',
  FROZEN: 'Frozen',
  INACTIVE: 'Inactive',
  PLANNED: 'Planned',
};

export const BUDGET_STATUSES_OPTIONS = [
  { labelId: 'ui-finance.budget.status.active', value: BUDGET_STATUSES.ACTIVE },
  { labelId: 'ui-finance.budget.status.closed', value: BUDGET_STATUSES.CLOSED },
  { labelId: 'ui-finance.budget.status.frozen', value: BUDGET_STATUSES.FROZEN },
  { labelId: 'ui-finance.budget.status.inactive', value: BUDGET_STATUSES.INACTIVE },
  { labelId: 'ui-finance.budget.status.planned', value: BUDGET_STATUSES.PLANNED },
];

export const SECTIONS_BUDGET = {
  INFORMATION: 'information',
  SUMMARY: 'summary',
  EXPENSE_CLASSES: 'expense-classes',
};

export const EXPENSE_CLASS_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
};

export const EXPENSE_CLASS_STATUS_OPTIONS = [
  { labelId: 'ui-finance.budget.expenseClasses.status.Active', value: EXPENSE_CLASS_STATUS.ACTIVE },
  { labelId: 'ui-finance.budget.expenseClasses.status.Inactive', value: EXPENSE_CLASS_STATUS.INACTIVE },
];
