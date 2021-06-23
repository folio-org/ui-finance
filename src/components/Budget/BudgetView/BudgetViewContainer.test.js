import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { BudgetViewContainer } from './BudgetViewContainer';

jest.mock('./BudgetView', () => jest.fn().mockReturnValue('BudgetView'));

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
  match: { params: { budgetId }, path: 'path', url: 'url' },
  location: { hash: 'hash', pathname: 'pathname' },
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
});
