import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import FundBudgets from './FundBudgets';

const defaultProps = {
  addBudgetButton: jest.fn(),
  budgets: [],
  budgetStatus: 'Active',
  currency: 'USD',
  labelId: 'budgetLabel',
  openBudget: jest.fn(),
  sectionId: 'sectionId',
};

const renderFundBudgets = (props = defaultProps) => (render(
  <FundBudgets
    {...props}
  />,
  { wrapper: MemoryRouter },
));

describe('FundBudgets component', () => {
  it('should display budget label', () => {
    const { getByText } = renderFundBudgets();

    expect(getByText(defaultProps.labelId)).toBeDefined();
  });
});
