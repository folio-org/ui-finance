import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  ERROR_CODE_GENERIC,
} from '@folio/stripes-acq-components';

export const handleCreateTransactionErrorResponse = async (
  intl,
  errorResponse,
  amountWithCurrency,
  budgetName,
  transactionTypeKey,
) => {
  let errorCode = null;

  try {
    const responseJson = await errorResponse.json();

    errorCode = responseJson?.errors?.[0]?.code || ERROR_CODE_GENERIC;
  } catch (parsingException) {
    errorCode = ERROR_CODE_GENERIC;
  }

  return (
    <FormattedMessage
      id={`ui-finance.transaction.${transactionTypeKey}.${errorCode}`}
      defaultMessage={intl.formatMessage(
        { id: `ui-finance.transaction.${transactionTypeKey}.${ERROR_CODE_GENERIC}` },
        { amount: amountWithCurrency, budgetName },
      )}
      values={{
        amount: amountWithCurrency,
        budgetName,
      }}
    />
  );
};
