import React from 'react';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter } from 'react-router';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import { BudgetViewContainer } from './BudgetViewContainer';

jest.mock('./BudgetView', () => jest.fn().mockReturnValue('BudgetView'));
jest.mock('../../../Transactions/CreateTransaction', () => jest.fn().mockReturnValue('Create transaction'));

const budgetId = 'budgetId';
const mutatorMock = {
  budgetById: {
    GET: jest.fn().mockReturnValue(Promise.resolve({ id: budgetId, fundId: 'fundId' })),
  },
  expenseClassesTotals: {
    GET: jest.fn().mockReturnValue(Promise.resolve([])),
  },
  budgetFiscalYear: {
    GET: jest.fn().mockReturnValue(Promise.resolve({ id: 'fyId' })),
  },
};
const locationMock = { hash: 'hash', pathname: 'pathname', search: 'search' };
const historyMock = {
  push: jest.fn(),
  action: 'PUSH',
  block: jest.fn(),
  createHref: jest.fn(),
  go: jest.fn(),
  listen: jest.fn(),
  location: locationMock,
};
const defaultProps = {
  mutator: mutatorMock,
  match: { params: { budgetId }, path: 'path', url: 'url', search: 'search' },
  location: locationMock,
  history: historyMock,
  stripes: {},
};

const renderBudgetViewContainer = (props = defaultProps) => render(
  <BudgetViewContainer
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('BudgetViewContainer', () => {
  it('should display BudgetView', async () => {
    renderBudgetViewContainer();

    await screen.findByText('BudgetView');

    expect(screen.getByText('BudgetView')).toBeDefined();
  });

  it('should open Increase allocation modal', async () => {
    renderBudgetViewContainer();

    await screen.findByText('BudgetView');
    await user.click(screen.getByTestId('increase-allocation-button'));
    await screen.findByText('Create transaction');

    expect(screen.getByText('Create transaction')).toBeDefined();
  });

  it('should open Decrease allocation modal', async () => {
    renderBudgetViewContainer();

    await screen.findByText('BudgetView');
    await user.click(screen.getByTestId('decrease-allocation-button'));
    await screen.findByText('Create transaction');

    expect(screen.getByText('Create transaction')).toBeDefined();
  });

  it('should open Move allocation modal', async () => {
    renderBudgetViewContainer();

    await screen.findByText('BudgetView');
    await user.click(screen.getByTestId('move-allocation-button'));
    await screen.findByText('Create transaction');

    expect(screen.getByText('Create transaction')).toBeDefined();
  });
});
