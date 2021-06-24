import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import BudgetFormContainer from './BudgetFormContainer';
import BudgetForm from './BudgetForm';

jest.mock('./BudgetForm', () => jest.fn().mockReturnValue('BudgetForm'));

const budgetId = 'budgetId';
const mutatorMock = {
  budget: {
    GET: jest.fn().mockReturnValue(Promise.resolve({ id: budgetId, fiscalYearId: 'fyId' })),
    POST: jest.fn(),
    PUT: jest.fn(),
  },
  expenseClasses: {
    GET: jest.fn().mockReturnValue(Promise.resolve([])),
  },
  fiscalYear: {
    GET: jest.fn().mockReturnValue(Promise.resolve({ id: 'fyId' })),
  },
};
const historyMock = {
  push: jest.fn(),
  action: 'PUSH',
  block: jest.fn(),
  createHref: jest.fn(),
  go: jest.fn(),
  listen: jest.fn(),
};
const defaultProps = {
  mutator: mutatorMock,
  match: { params: { id: budgetId }, path: 'path', url: 'url', search: 'search' },
  location: { hash: 'hash', pathname: 'pathname', search: 'search' },
  history: historyMock,
};

const renderBudgetFormContainer = (props = defaultProps) => render(
  <BudgetFormContainer
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('BudgetFormContainer', () => {
  it('should display BudgetForm', async () => {
    renderBudgetFormContainer();

    await screen.findByText('BudgetForm');

    expect(screen.getByText('BudgetForm')).toBeDefined();
  });

  it('should close budget form', async () => {
    historyMock.push.mockClear();

    await act(async () => renderBudgetFormContainer());

    BudgetForm.mock.calls[0][0].onClose();

    expect(historyMock.push.mock.calls[0][0].pathname).toBe(`/finance/budget/${budgetId}/view`);
  });

  it('should save new budget', async () => {
    historyMock.push.mockClear();
    mutatorMock.budget.POST.mockReturnValue(Promise.resolve({}));

    await act(async () => renderBudgetFormContainer());

    BudgetForm.mock.calls[0][0].onSubmit({});

    expect(mutatorMock.budget.POST).toHaveBeenCalled();
  });

  it('should save budget', async () => {
    historyMock.push.mockClear();
    mutatorMock.budget.PUT.mockReturnValue(Promise.resolve({}));

    await act(async () => renderBudgetFormContainer());

    BudgetForm.mock.calls[0][0].onSubmit({ id: budgetId, name: 'budgetName' });

    expect(mutatorMock.budget.PUT).toHaveBeenCalled();
  });
});
