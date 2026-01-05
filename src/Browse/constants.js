import React from 'react';
import { FormattedMessage } from 'react-intl';

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

export const STATUS_OPTIONS = {
  ACTIVE: 'Active',
  FROZEN: 'Frozen',
  INACTIVE: 'Inactive',
};

export const BUDGET_STATUS_OPTIONS = {
  ACTIVE: 'Active',
  CLOSED: 'Closed',
  FROZEN: 'Frozen',
  INACTIVE: 'Inactive',
  PLANNED: 'Planned',
};

export const EXPENSE_CLASS_STATUS_OPTIONS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
};

export const LEDGER_STATUS_OPTIONS_BROWSE = Object.values(STATUS_OPTIONS).map(status => ({
  labelId: `ui-finance.ledger.status.${status.toLowerCase()}`,
  value: status,
}));

export const GROUP_STATUS_OPTIONS_BROWSE = Object.values(STATUS_OPTIONS).map(status => ({
  labelId: `ui-finance.groups.status.${status.toLowerCase()}`,
  value: status,
}));

export const FUND_STATUS_OPTIONS_BROWSE = Object.values(STATUS_OPTIONS).map(status => ({
  labelId: `ui-finance.fund.status.${status.toLowerCase()}`,
  value: status,
}));

export const BUDGET_STATUS_OPTIONS_BROWSE = Object.values(BUDGET_STATUS_OPTIONS).map(status => ({
  labelId: `ui-finance.budget.status.${status.toLowerCase()}`,
  value: status,
}));

export const EXPENSE_CLASS_STATUS_OPTIONS_BROWSE = Object.values(EXPENSE_CLASS_STATUS_OPTIONS).map(status => ({
  labelId: `ui-finance.budget.expenseClasses.status.${status}`,
  value: status,
}));

