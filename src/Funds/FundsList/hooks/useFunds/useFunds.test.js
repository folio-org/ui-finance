import { renderHook } from '@testing-library/react-hooks';
import { useLocation } from 'react-router';
import { QueryClient, QueryClientProvider } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { useFunds } from './useFunds';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLocation: jest.fn(),
}));
jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useNamespace: () => ['namespace'],
  useOkapiKy: jest.fn(),
}));

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const funds = [{ ledgerId: 'ledgerId' }];

describe('useFunds', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => ({
            funds,
            totalRecords: funds.length,
          }),
        }),
      });
  });

  it('should return an empty list if there no filters were passed in the query', async () => {
    useLocation
      .mockClear()
      .mockReturnValue({ search: '' });

    const { result, waitFor } = renderHook(() => useFunds({
      pagination: { limit: 5, offset: 0, timestamp: 42 },
    }), { wrapper });

    await waitFor(() => !result.current.isFetching);

    expect(result.current).toEqual({
      funds: [],
      totalRecords: 0,
      isFetching: false,
    });
  });

  it('should return fetched hydrated funds list', async () => {
    useLocation
      .mockClear()
      .mockReturnValue({ search: 'fundStatus=Active' });

    const fetchReferences = jest.fn().mockReturnValue(Promise.resolve({
      ledgersMap: { [funds[0].ledgerId]: { name: 'ledgerName' } },
    }));
    const { result, waitFor } = renderHook(() => useFunds({
      pagination: { limit: 5, offset: 0, timestamp: 42 },
      fetchReferences,
    }), { wrapper });

    await waitFor(() => !result.current.isFetching);

    expect(result.current).toEqual({
      funds: [{
        ledgerId: 'ledgerId',
        ledger: 'ledgerName',
      }],
      totalRecords: 1,
      isFetching: false,
    });
  });
});
