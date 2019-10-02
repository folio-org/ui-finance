import React from 'react';
import { FormattedMessage } from 'react-intl';

export const SECTIONS_FUND = {
  INFORMATION: 'information',
  CURRENT_BUDGET: 'currentBudget',
  PLANNED_BUDGET: 'plannedBudget',
  PREVIOUS_BUDGETS: 'previousBudgets',
};

export const FUND_FORM = 'fundForm';

export const FUND_STATUSES = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  FROZEN: 'Frozen',
};

export const FUND_STATUSES_OPTIONS = [
  { label: <FormattedMessage id="ui-finance.fund.status.active" />, value: FUND_STATUSES.ACTIVE },
  { label: <FormattedMessage id="ui-finance.fund.status.inactive" />, value: FUND_STATUSES.INACTIVE },
  { label: <FormattedMessage id="ui-finance.fund.status.frozen" />, value: FUND_STATUSES.FROZEN },
];

export const FUND_FILTERS = {
  LEDGER: 'ledgerId',
  STATUS: 'fundStatus',
  TYPE: 'fundTypeId',
  GROUP: 'groupId',
  ACQUISITIONS_UNIT: 'acqUnitIds',
};
