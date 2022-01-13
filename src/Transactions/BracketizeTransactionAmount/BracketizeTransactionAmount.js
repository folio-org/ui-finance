import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { IconButton, InfoPopover } from '@folio/stripes/components';
import { AmountWithCurrencyField } from '@folio/stripes-acq-components';

import css from './BracketizeTransactionAmount.css';

export function BracketizeTransactionAmount({
  fundId,
  transaction,
  iconSize,
}) {
  const amount = Math.abs(transaction.amount);
  const isVoided = transaction.invoiceCancelled;
  let showBrackets = false;

  if (transaction.toFundId === fundId && transaction.amount < 0) showBrackets = true;
  if (transaction.fromFundId === fundId && transaction.amount > 0) showBrackets = true;

  // eslint-disable-next-line react/prop-types
  const renderTrigger = ({ open, ref, toggle }) => (
    <IconButton
      ref={ref}
      icon="info"
      iconClassName={open ? css.open : ''}
      iconSize={iconSize}
      onClick={e => {
        e.stopPropagation();
        toggle();
      }}
    />
  );

  return (
    <>
      <span className={isVoided ? css.voided : ''}>
        <AmountWithCurrencyField
          amount={amount}
          currency={transaction.currency}
          showBrackets={showBrackets}
        />
      </span>
      {isVoided && (
        <div onFocus={e => e.stopPropagation()}>
          <InfoPopover
            renderTrigger={renderTrigger}
            content={<FormattedMessage id="ui-finance.transaction.voided" />}
          />
        </div>
      )}
    </>
  );
}

BracketizeTransactionAmount.propTypes = {
  fundId: PropTypes.string.isRequired,
  transaction: PropTypes.object.isRequired,
  iconSize: PropTypes.string,
};
