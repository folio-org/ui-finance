import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import BudgetFormContainer from './BudgetFormContainer';

jest.mock('./BudgetForm', () => jest.fn().mockReturnValue('BudgetForm'));

const budgetId = 'budgetId';
const mutatorMock = {
  budget: {
    GET: jest.fn(),
  },
  expenseClasses: {
    GET: jest.fn(),
  },
};
const historyMock = {
  push: jest.fn(),
};
const defaultProps = {
  mutator: mutatorMock,
  match: { params: { id: budgetId } },
  location: {},
  history: historyMock,
};

const renderBudgetFormContainer = (props = defaultProps) => render(
  <BudgetFormContainer
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('BudgetFormContainer', () => {
  it('should load all data', () => {
    renderBudgetFormContainer();

    expect(mutatorMock.budget.GET).toHaveBeenCalled();
    expect(mutatorMock.expenseClasses.GET).toHaveBeenCalled();
  });
});
