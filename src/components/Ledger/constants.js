import React from 'react';
import { FormattedMessage } from 'react-intl';

export const LEDGER_ACCORDTION = {
  information: 'information',
  fund: 'fund',
};

export const LEDGER_ACCORDTION_LABELS = {
  [LEDGER_ACCORDTION.information]: <FormattedMessage id="ui-finance.ledger.information" />,
  [LEDGER_ACCORDTION.fund]: <FormattedMessage id="ui-finance.ledger.fund" />,
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
