export const BROWSE_TABS = {
  SEARCH: 'search',
  BROWSE: 'browse',
};

export const BROWSE_FILTERS = {
  FISCAL_YEAR: 'fiscalYearId',
  LEDGER_STATUS: 'ledgerStatus',
  GROUP_STATUS: 'groupStatus',
  FUND_STATUS: 'fundStatus',
  BUDGET_STATUS: 'budgetStatus',
  EXPENSE_CLASS_STATUS: 'expenseClassStatus',
};

export const HIERARCHY_NODE_TYPES = {
  LEDGER: 'ledger',
  GROUP: 'group',
  FUND: 'fund',
  BUDGET: 'budget',
  EXPENSE_CLASS: 'expenseClass',
};

// Funds of a ledger that have no group for the fiscal year are listed under a synthetic group with this id
export const UNGROUPED_NODE_ID = 'ungrouped';

// Levels of the hierarchy that can be expanded and collapsed all at once
export const EXPANDABLE_NODE_TYPES = [
  HIERARCHY_NODE_TYPES.LEDGER,
  HIERARCHY_NODE_TYPES.GROUP,
  HIERARCHY_NODE_TYPES.FUND,
  HIERARCHY_NODE_TYPES.BUDGET,
];

// Levels that are expanded when the hierarchy is first displayed
export const DEFAULT_EXPANDED_NODE_TYPES = [
  HIERARCHY_NODE_TYPES.LEDGER,
  HIERARCHY_NODE_TYPES.GROUP,
];
