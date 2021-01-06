import React from 'react';
import { FormattedMessage } from 'react-intl';

export const GROUP_ACCORDTION = {
  information: 'information',
  financialSummary: 'financial-summary',
  fund: 'fund',
  expenseClasses: 'expenseClasses',
};

export const GROUP_ACCORDTION_LABELS = {
  [GROUP_ACCORDTION.information]: <FormattedMessage id="ui-finance.groups.item.information" />,
  [GROUP_ACCORDTION.financialSummary]: <FormattedMessage id="ui-finance.groups.item.financialSummary" />,
  [GROUP_ACCORDTION.fund]: <FormattedMessage id="ui-finance.groups.item.fund" />,
  [GROUP_ACCORDTION.expenseClasses]: <FormattedMessage id="ui-finance.groups.item.expenseClasses" />,
};

export const GROUP_STATUS = {
  active: 'Active',
  frozen: 'Frozen',
  inactive: 'Inactive',
};

export const GROUP_STATUS_LABEL = {
  [GROUP_STATUS.active]: <FormattedMessage id="ui-finance.groups.status.active" />,
  [GROUP_STATUS.frozen]: <FormattedMessage id="ui-finance.groups.status.frozen" />,
  [GROUP_STATUS.inactive]: <FormattedMessage id="ui-finance.groups.status.inactive" />,
};

export const GROUP_STATUS_OPTIONS = Object.values(GROUP_STATUS).map(status => ({
  label: GROUP_STATUS_LABEL[status],
  value: status,
}));

export const GROUPS_FILTERS = {
  STATUS: 'status',
  ACQUISITIONS_UNIT: 'acqUnitIds',
};
