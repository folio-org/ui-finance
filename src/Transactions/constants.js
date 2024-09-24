import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  ERROR_CODE_GENERIC,
  TRANSACTION_TYPES,
} from '@folio/stripes-acq-components';

import { ENCUMBRANCE_STATUS } from '../common/const';

export const TRANSACTION_ACCORDION = {
  information: 'information',
};

export const TRANSACTION_ACCORDION_LABELS = {
  [TRANSACTION_ACCORDION.information]: <FormattedMessage id="ui-finance.transaction.information" />,
};

export const TRANSACTION_TYPE_OPTIONS = Object.values(TRANSACTION_TYPES).map(transactionType => ({
  label: <FormattedMessage id={`ui-finance.transaction.type.${transactionType}`} />,
  value: transactionType,
}));

export const ENCUMBRANCE_STATUS_OPTIONS = Object.values(ENCUMBRANCE_STATUS).map(status => ({
  label: <FormattedMessage id={`ui-finance.transaction.status.${status}`} />,
  value: status,
}));

export const TRANSACTION_SOURCE = {
  fiscalYear: 'FiscalYear',
  invoice: 'Invoice',
  poLine: 'PoLine',
  user: 'User',
};

export const TRANSACTION_SOURCE_OPTIONS = Object.values(TRANSACTION_SOURCE).map(source => ({
  label: <FormattedMessage id={`ui-finance.transaction.source.${source}`} />,
  value: source,
}));

export const ALLOCATION_TYPE = {
  increase: 'increase',
  decrease: 'decrease',
};

export const ERROR_CODES = {
  [ERROR_CODE_GENERIC]: ERROR_CODE_GENERIC,
  allowableAllocationIdsMismatch: 'allowableAllocationIdsMismatch',
  budgetNotFoundForTransaction: 'budgetNotFoundForTransaction',
  budgetRestrictedExpendituresError: 'budgetRestrictedExpendituresError',
  currentBudgetNotFound: 'currentBudgetNotFound',
  missingFundId: 'missingFundId',
  notEnoughMoneyForAllocationError: 'notEnoughMoneyForAllocationError',
  notEnoughMoneyForTransferError: 'notEnoughMoneyForTransferError',
};
