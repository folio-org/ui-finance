import React from 'react';
import { render } from '@testing-library/react';

import TransactionsFilters from './TransactionsFilters';

const defaultProps = {
  activeFilters: {},
  applyFilters: jest.fn(),
  disabled: false,
};

const renderTransactionFilters = (props = defaultProps) => (render(
  <TransactionsFilters
    {...props}
  />,
));

describe('TransactionsFilters component', () => {
  it('should display transaction list filters', () => {
    const { getByText } = renderTransactionFilters();

    expect(getByText('ui-finance.transaction.type')).toBeDefined();
    expect(getByText('ui-finance.transaction.source')).toBeDefined();
    expect(getByText('ui-finance.transaction.expenseClass')).toBeDefined();
  });
});
