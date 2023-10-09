import React from 'react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import ExpenseClasses from './ExpenseClasses';

const EXPENSE_CLASSES = [
  {
    id: '1',
    expenseClassName: 'expenseClassName-1',
    expenseClassStatus: 'Active',
    expended: 1,
    percentageExpended: 10,
    encumbered: 10,
    awaitingPayment: 100,
  },
  {
    id: '2',
    expenseClassName: 'expenseClassName-2',
    expenseClassStatus: 'Inactive',
    expended: 10,
    percentageExpended: 100,
    encumbered: 1,
    awaitingPayment: 10,
  },
];

const renderComponent = () => render(
  <MemoryRouter>
    <IntlProvider>
      <ExpenseClasses
        expenseClassesTotals={EXPENSE_CLASSES}
        id="id"
      />
    </IntlProvider>
  </MemoryRouter>,
);

describe('ExpenseClasses', () => {
  it('should default sort list by name', async () => {
    renderComponent();
    const names = screen.getAllByTestId('nameColumn');

    expect(names[0].textContent).toBe('expenseClassName-1');
  });

  it('should sort list by name in reverse', async () => {
    renderComponent();
    await user.click(screen.getByText('ui-finance.budget.expenseClasses.expenseClassName'));
    const names = screen.getAllByTestId('nameColumn');

    expect(names[0].textContent).toBe('expenseClassName-2');
  });

  it('should sort list by status', async () => {
    renderComponent();
    await user.click(screen.getByText('ui-finance.budget.expenseClasses.status'));
    const names = screen.getAllByTestId('nameColumn');

    expect(names[0].textContent).toBe('expenseClassName-1');
  });

  it('should sort list by expended', async () => {
    renderComponent();
    await user.click(screen.getByText('ui-finance.budget.expenseClasses.expended'));
    const names = screen.getAllByTestId('nameColumn');

    expect(names[0].textContent).toBe('expenseClassName-2');
  });

  it('should sort list by percentageExpended', async () => {
    renderComponent();
    await user.click(screen.getByText('ui-finance.budget.expenseClasses.percentageExpended'));
    const names = screen.getAllByTestId('nameColumn');

    expect(names[0].textContent).toBe('expenseClassName-2');
  });

  it('should sort list by encumbered', async () => {
    renderComponent();
    await user.click(screen.getByText('ui-finance.budget.expenseClasses.encumbered'));
    const names = screen.getAllByTestId('nameColumn');

    expect(names[0].textContent).toBe('expenseClassName-1');
  });

  it('should sort list by awaitingPayment', async () => {
    renderComponent();
    await user.click(screen.getByText('ui-finance.budget.expenseClasses.awaitingPayment'));
    const names = screen.getAllByTestId('nameColumn');

    expect(names[0].textContent).toBe('expenseClassName-1');
  });
});
