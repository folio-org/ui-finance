import React from 'react';
import { FormattedMessage } from 'react-intl';

export const LEDGER_ACCORDTION = {
  information: 'information',
  financialSummary: 'financial-summary',
  fund: 'fund',
  group: 'group',
  rolloverErrors: 'rolloverErrors',
};

export const LEDGER_ACCORDTION_LABELS = {
  [LEDGER_ACCORDTION.information]: <FormattedMessage id="ui-finance.ledger.information" />,
  [LEDGER_ACCORDTION.financialSummary]: <FormattedMessage id="ui-finance.ledger.financialSummary" />,
  [LEDGER_ACCORDTION.fund]: <FormattedMessage id="ui-finance.ledger.fund" />,
  [LEDGER_ACCORDTION.group]: <FormattedMessage id="ui-finance.ledger.group" />,
  [LEDGER_ACCORDTION.rolloverErrors]: <FormattedMessage id="ui-finance.ledger.rolloverErrors" />,
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
  transfer: 'Available',
  allocation: 'Allocation',
};

export const ADD_AVAILABLE_TO_LABEL = {
  [ADD_AVAILABLE_TO.transfer]: 'ui-finance.ledger.rollover.addAvailableTo.transfer',
  [ADD_AVAILABLE_TO.allocation]: 'ui-finance.ledger.rollover.addAvailableTo.allocation',
};

export const ADD_AVAILABLE_TO_OPTIONS = Object.values(ADD_AVAILABLE_TO).map(d => ({
  labelId: ADD_AVAILABLE_TO_LABEL[d],
  value: d,
}));

export const BASED_ON = {
  expended: 'Expended',
  initialEncumbrance: 'Initial encumbrance',
  remaining: 'Remaining',
};

export const BASED_ON_LABEL_ID = {
  [BASED_ON.expended]: 'ui-finance.ledger.rollover.basedOn.expended',
  [BASED_ON.initialEncumbrance]: 'ui-finance.ledger.rollover.basedOn.initialEncumbrance',
  [BASED_ON.remaining]: 'ui-finance.ledger.rollover.basedOn.remaining',
};

export const BASED_ON_OPTIONS = Object.values(BASED_ON).map(d => ({
  labelId: BASED_ON_LABEL_ID[d],
  value: d,
}));

export const ORDER_TYPE = {
  ongoing: 'Ongoing',
  ongoingSubscription: 'Ongoing-Subscription',
  onetime: 'One-time',
};

export const ORDER_TYPE_LABEL = {
  [ORDER_TYPE.ongoing]: <FormattedMessage id="ui-finance.ledger.rollover.orderType.ongoing" />,
  [ORDER_TYPE.ongoingSubscription]: <FormattedMessage id="ui-finance.ledger.rollover.orderType.ongoingSubscription" />,
  [ORDER_TYPE.onetime]: <FormattedMessage id="ui-finance.ledger.rollover.orderType.onetime" />,
};
