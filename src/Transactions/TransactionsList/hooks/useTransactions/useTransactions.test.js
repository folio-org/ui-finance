import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { useLocation } from 'react-router';
import { QueryClient, QueryClientProvider } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { useBuildQuery } from '../useBuildQuery';
import { useTransactions } from './useTransactions';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLocation: jest.fn(),
}));
jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useNamespace: () => ['namespace'],
  useOkapiKy: jest.fn(),
}));
jest.mock('../useBuildQuery', () => ({ useBuildQuery: jest.fn() }));

const transactions = [{ id: 'transactionId', amount: 100 }];
const queryMock = '(cql.allRecords=1) sortby transactionDate/sort.descending';
const budgetMock = {
  id: 'id',
  fiscalYearId: 'fyId',
  fundId: 'fundId',
};

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useTransactions', () => {
  beforeEach(() => {
    useBuildQuery.mockReturnValue(jest.fn(() => queryMock));

    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => ({
            transactions,
            totalRecords: transactions.length,
          }),
        }),
      });
  });

  it('should return fetched transactions', async () => {
    useLocation
      .mockClear()
      .mockReturnValue({ search: '' });

    const { result, waitFor } = renderHook(() => useTransactions({
      budget: budgetMock,
      pagination: { limit: 5, offset: 0, timestamp: 42 },
    }), { wrapper });

    await waitFor(() => !result.current.isFetching);

    expect(result.current.totalRecords).toEqual(transactions.length);
  });
});
