import React from 'react';
import { FormattedMessage } from 'react-intl';

export const TRANSACTION_ACCORDION = {
  information: 'information',
};

export const TRANSACTION_ACCORDION_LABELS = {
  [TRANSACTION_ACCORDION.information]: <FormattedMessage id="ui-finance.transaction.information" />,
};

export const TRANSACTION_TYPES = {
  allocation: 'Allocation',
  credit: 'Credit',
  encumbrance: 'Encumbrance',
  payment: 'Payment',
  transfer: 'Transfer',
};

export const TRANSACTION_TYPE_OPTIONS = Object.values(TRANSACTION_TYPES).map(transactionType => ({
  label: <FormattedMessage id={`ui-finance.transaction.type.${transactionType}`} />,
  value: transactionType,
}));

export const TRANSACTION_SOURCE = {
  credit: 'Credit',
  manual: 'Manual',
  user: 'User',
  voucher: 'Voucher',
};
