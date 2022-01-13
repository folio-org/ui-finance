import React from 'react';
import user from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import { BracketizeTransactionAmount } from './BracketizeTransactionAmount';

const defaultProps = {
  fundId: 'fundId',
};

const renderBracketizeTransactionAmount = (props = defaultProps) => (render(
  <BracketizeTransactionAmount
    {...props}
  />,
));

describe('BracketizeTransactionAmount component', () => {
  it('should display amount in brackets', () => {
    const transaction = { toFundId: defaultProps.fundId, amount: -10 };
    const { getByText } = renderBracketizeTransactionAmount({ ...defaultProps, transaction });

    expect(getByText('($10.00)')).toBeDefined();
  });

  it('should display amount without brackets', () => {
    const transaction = { toFundId: defaultProps.fundId, amount: 10 };
    const { getByText } = renderBracketizeTransactionAmount({ ...defaultProps, transaction });

    expect(getByText('$10.00')).toBeDefined();
  });

  it('should display info for voided transaction', () => {
    const transaction = {
      toFundId: defaultProps.fundId,
      amount: -10,
      invoiceCancelled: true,
    };

    renderBracketizeTransactionAmount({ ...defaultProps, transaction });

    const iconBtn = screen.getByRole('button');

    user.click(iconBtn);

    expect(screen.getByText('ui-finance.transaction.voided')).toBeInTheDocument();
  });
});
