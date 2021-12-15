import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import TransactionsListContainer from './TransactionsListContainer';
import { useBudget } from './hooks';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router'),
  useRouteMatch: jest.fn().mockReturnValue({ params: { budgetId: 'budgetId' } }),
}));
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  usePagination: () => ({}),
  useAllFunds: () => ({}),
}));
jest.mock('./hooks', () => ({
  ...jest.requireActual('./hooks'),
  useBudget: jest.fn().mockReturnValue({}),
  useTransactions: jest.fn().mockReturnValue({}),
}));
jest.mock('./TransactionsList', () => jest.fn().mockReturnValue('TransactionsList'));

const defaultProps = {
  closePane: jest.fn(),
};
const renderTransactionsListContainer = (props = defaultProps) => render(
  <TransactionsListContainer {...props} />,
  { wrapper: MemoryRouter },
);

describe('TransactionsListContainer', () => {
  beforeEach(() => {
    useBudget.mockClear().mockReturnValue({ budget: { fundId: 'fundId' } });
  });
  it('should display TransactionsList', async () => {
    await act(async () => renderTransactionsListContainer());

    await screen.findByText('TransactionsList');

    expect(screen.getByText('TransactionsList')).toBeDefined();
  });
});
