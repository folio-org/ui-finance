import React from 'react';
import PropTypes from 'prop-types';

import { AmountWithCurrencyField } from '@folio/stripes-acq-components';

export function BracketizeTransactionAmount({ fundId, transaction }) {
  let amount = transaction.amount;
  let showBrackets = false;

  if (transaction.toFundId === fundId && transaction.amount < 0) showBrackets = true;
  if (transaction.fromFundId === fundId && transaction.amount > 0) showBrackets = true;
  amount = Math.abs(transaction.amount);

  return (
    <>
      {showBrackets && '('}
      <AmountWithCurrencyField
        amount={amount}
        currency={transaction.currency}
      />
      {showBrackets && ')'}
    </>
  );
}

BracketizeTransactionAmount.propTypes = {
  fundId: PropTypes.string.isRequired,
  transaction: PropTypes.object.isRequired,
};
