import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@folio/jest-config-stripes/testing-library/react';

import BudgetView from './BudgetView';

const defaultProps = {
  budget: {},
  expenseClassesTotals: [],
  fiscalYearCurrency: 'USD',
};

const renderBudgetView = (props = defaultProps) => (render(
  <BudgetView
    {...props}
  />,
  { wrapper: MemoryRouter },
));

describe('BudgetView component', () => {
  it('should display budget view accordions', () => {
    const { getByText } = renderBudgetView();

    expect(getByText('ui-finance.budget.summary.title')).toBeDefined();
    expect(getByText('ui-finance.budget.information.title')).toBeDefined();
  });

  it('should not display budget expense classes accordion', () => {
    const { queryByText } = renderBudgetView();

    expect(queryByText('ui-finance.budget.expenseClasses.title')).toBeNull();
  });

  it('should display budget expense classes accordion', () => {
    const { queryByText } = renderBudgetView({ ...defaultProps, expenseClassesTotals: [{ id: '001' }] });

    expect(queryByText('ui-finance.budget.expenseClasses.title')).toBeDefined();
  });
});
