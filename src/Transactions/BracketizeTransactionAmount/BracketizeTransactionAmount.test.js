import React from 'react';
import { render } from '@testing-library/react';

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
});
