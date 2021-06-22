import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import TransactionsList from './TransactionsList';
import { TransactionsListContainer } from './TransactionsListContainer';

jest.mock('./TransactionsList', () => jest.fn().mockReturnValue('TransactionsList'));

const historyMock = {
  push: jest.fn(),
  action: 'PUSH',
  block: jest.fn(),
};
const mutatorMock = {
  budget: {
    GET: jest.fn(),
  },
  fundsTransactionsList: {
    GET: jest.fn(),
  },
  transactions: {
    GET: jest.fn(),
  },
  resultCount: {
    replace: jest.fn(),
  },
};
const defaultProps = {
  mutator: mutatorMock,
  match: { params: { budgetId: 'id' }, path: 'path' },
  history: historyMock,
  resources: { fundsTransactionsList: { hasLoaded: true }, budget: { records: [{ id: 'id', name: 'budgetName' }] } },
  closePane: jest.fn(),
};
const renderTransactionsListContainer = (props = defaultProps) => render(
  <TransactionsListContainer {...props} />,
  { wrapper: MemoryRouter },
);

describe('TransactionsListContainer', () => {
  beforeEach(() => {
    historyMock.push.mockClear();
    mutatorMock.resultCount.replace.mockClear();
  });
  it('should display TransactionsList', async () => {
    renderTransactionsListContainer();

    await screen.findByText('TransactionsList');

    expect(screen.getByText('TransactionsList')).toBeDefined();
  });

  it('should fetch more data', async () => {
    await act(async () => renderTransactionsListContainer());

    TransactionsList.mock.calls[0][0].onNeedMoreData();

    expect(mutatorMock.resultCount.replace).toHaveBeenCalled();
  });

  it('should reset data', async () => {
    await act(async () => renderTransactionsListContainer());

    TransactionsList.mock.calls[0][0].resetData();

    expect(mutatorMock.resultCount.replace).toHaveBeenCalled();
  });
});
