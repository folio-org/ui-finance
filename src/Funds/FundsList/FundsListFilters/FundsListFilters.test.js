import React from 'react';
import { render } from '@testing-library/react';

import FundsListFilters from './FundsListFilters';

const defaultProps = {
  activeFilters: {},
  applyFilters: jest.fn(),
  disabled: false,
};

const renderFundsListFilters = (props = defaultProps) => (render(
  <FundsListFilters
    {...props}
  />,
));

describe('FundsListFilters component', () => {
  it('should display fund list filters', () => {
    const { getByText } = renderFundsListFilters();

    expect(getByText('ui-finance.fund.filters.ledger')).toBeDefined();
    expect(getByText('ui-finance.fund.filters.acqUnits')).toBeDefined();
    expect(getByText('ui-finance.fund.filters.status')).toBeDefined();
    expect(getByText('ui-finance.fund.filters.type')).toBeDefined();
    expect(getByText('ui-finance.fund.filters.group')).toBeDefined();
  });
});
