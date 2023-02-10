import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Row } from '@folio/stripes/components';

import HeadLabel from './RolloverLedger/HeadLabel';

export const LEDGER_ACCORDION = {
  information: 'information',
  financialSummary: 'financial-summary',
  fund: 'fund',
  group: 'group',
  rolloverErrors: 'rolloverErrors',
};

export const LEDGER_ACCORDION_LABELS = {
  [LEDGER_ACCORDION.information]: <FormattedMessage id="ui-finance.ledger.information" />,
  [LEDGER_ACCORDION.financialSummary]: <FormattedMessage id="ui-finance.ledger.financialSummary" />,
  [LEDGER_ACCORDION.fund]: <FormattedMessage id="ui-finance.ledger.fund" />,
  [LEDGER_ACCORDION.group]: <FormattedMessage id="ui-finance.ledger.group" />,
  [LEDGER_ACCORDION.rolloverErrors]: <FormattedMessage id="ui-finance.ledger.rolloverErrors" />,
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
  initialEncumbrance: 'InitialAmount',
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

export const ROLLOVER_BUDGET_VALUE = {
  none: 'None',
  available: 'Available',
  cashBalance: 'CashBalance',
};

export const ROLLOVER_BUDGET_VALUE_LABELS = {
  [ROLLOVER_BUDGET_VALUE.none]: 'ui-finance.ledger.rollover.rolloverBudgetValue.none',
  [ROLLOVER_BUDGET_VALUE.available]: 'ui-finance.ledger.rollover.rolloverBudgetValue.available',
  [ROLLOVER_BUDGET_VALUE.cashBalance]: 'ui-finance.ledger.rollover.rolloverBudgetValue.cashBalance',
};

export const ROLLOVER_BUDGET_VALUE_OPTIONS = Object.values(ROLLOVER_BUDGET_VALUE).map(value => ({
  labelId: ROLLOVER_BUDGET_VALUE_LABELS[value],
  value,
}));

export const ROLLOVER_LEDGER_BUDGETS_HEAD_LABELS = (
  <Row>
    <HeadLabel translationId="ui-finance.ledger.rollover.fundType" />
    <HeadLabel translationId="ui-finance.ledger.rollover.allocation" />
    <HeadLabel translationId="ui-finance.ledger.rollover.adjustAllocation" size={1} />
    <HeadLabel translationId="ui-finance.ledger.rollover.rolloverBudgetValue" />
    <HeadLabel translationId="ui-finance.ledger.rollover.rolloverValueAs" />
    <HeadLabel translationId="ui-finance.ledger.rollover.setAllowances" size={1} />
    <HeadLabel translationId="ui-finance.ledger.rollover.allowableEncumbrance" size={1} />
    <HeadLabel translationId="ui-finance.ledger.rollover.allowableExpenditure" size={1} />
  </Row>
);

export const ROLLOVER_ENCUMBRANCES_HEAD_LABELS = (
  <Row>
    <HeadLabel translationId="ui-finance.ledger.rollover.orderType" />
    <HeadLabel translationId="ui-finance.ledger.rollover.rollover" />
    <HeadLabel translationId="ui-finance.ledger.rollover.basedOn" />
    <HeadLabel translationId="ui-finance.ledger.rollover.increaseBy" />
  </Row>
);
