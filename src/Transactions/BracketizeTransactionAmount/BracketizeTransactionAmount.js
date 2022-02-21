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
  const isVoided = transaction.invoiceCancelled;
  const amount = Math.abs(isVoided ? transaction.voidedAmount : transaction.amount);
  let showBrackets = false;

  if (transaction.toFundId === fundId && transaction.amount < 0) showBrackets = true;
  if (transaction.fromFundId === fundId && transaction.amount > 0) showBrackets = true;

  // eslint-disable-next-line react/prop-types
  const renderTrigger = ({ open, ref, toggle }) => (
    <IconButton
      ref={ref}
      icon="info"
      innerClassName={css.icon}
      iconClassName={open ? css.open : ''}
      iconSize={iconSize}
      onClick={e => {
        e.stopPropagation();
        toggle();
      }}
    />
  );

  return (
    <div className={css.flex}>
      <span className={isVoided ? css.voided : ''}>
        <AmountWithCurrencyField
          amount={amount}
          currency={transaction.currency}
          showBrackets={showBrackets}
        />
      </span>
      {isVoided && (
        <div
          className={css.flex}
          onFocus={e => e.stopPropagation()}
        >
          <InfoPopover
            renderTrigger={renderTrigger}
            content={<FormattedMessage id="ui-finance.transaction.voided" />}
          />
        </div>
      )}
    </div>
  );
}

BracketizeTransactionAmount.propTypes = {
  fundId: PropTypes.string.isRequired,
  transaction: PropTypes.object.isRequired,
  iconSize: PropTypes.string,
};
