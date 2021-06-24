import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import FundExpenseClasses from './FundExpenseClasses';

const defaultProps = {
  budgetId: 'budgetId',
  currency: 'USD',
  resources: { totals: { failed: false, isPending: false, records: [{}] } },
};

const renderFundExpenseClasses = (props = defaultProps) => (render(
  <FundExpenseClasses
    {...props}
  />,
  { wrapper: MemoryRouter },
));

describe('FundExpenseClasses component', () => {
  it('should display label', () => {
    const { getByText } = renderFundExpenseClasses();

    expect(getByText('ui-finance.fund.currentExpenseClasses')).toBeDefined();
  });
});
