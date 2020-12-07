import React from 'react';
import { FormattedMessage } from 'react-intl';

export const LEDGER_ACCORDTION = {
  information: 'information',
  fund: 'fund',
  group: 'group',
};

export const LEDGER_ACCORDTION_LABELS = {
  [LEDGER_ACCORDTION.information]: <FormattedMessage id="ui-finance.ledger.information" />,
  [LEDGER_ACCORDTION.fund]: <FormattedMessage id="ui-finance.ledger.fund" />,
  [LEDGER_ACCORDTION.group]: <FormattedMessage id="ui-finance.ledger.group" />,
};

export const LEDGER_FILTERS = {
  STATUS: 'ledgerStatus',
  ACQUISITIONS_UNIT: 'acqUnitIds',
};

export const LEDGER_STATUS = {
  active: 'Active',
  frozen: 'Frozen',
  inactive: 'Inactive',
};

export const LEDGER_STATUS_LABEL = {
  [LEDGER_STATUS.active]: <FormattedMessage id="ui-finance.ledger.status.active" />,
  [LEDGER_STATUS.frozen]: <FormattedMessage id="ui-finance.ledger.status.frozen" />,
  [LEDGER_STATUS.inactive]: <FormattedMessage id="ui-finance.ledger.status.inactive" />,
};

export const LEDGER_STATUS_OPTIONS = Object.values(LEDGER_STATUS).map(status => ({
  label: LEDGER_STATUS_LABEL[status],
  value: status,
}));

export const ADD_AVAILABLE_TO = {
  available: 'Available',
  allocation: 'Allocation',
};

export const ADD_AVAILABLE_TO_LABEL = {
  [ADD_AVAILABLE_TO.available]: 'ui-finance.ledger.rollover.addAvailableTo.available',
  [ADD_AVAILABLE_TO.allocation]: 'ui-finance.ledger.rollover.addAvailableTo.allocation',
};

export const ADD_AVAILABLE_TO_OPTIONS = Object.values(ADD_AVAILABLE_TO).map(d => ({
  labelId: ADD_AVAILABLE_TO_LABEL[d],
  value: d,
}));
