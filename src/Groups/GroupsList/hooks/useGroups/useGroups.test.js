import { useLocation } from 'react-router';
import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useBuildQuery } from '../useBuildQuery';
import { useGroups } from './useGroups';

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

const groups = [{ name: 'group' }];
const queryMock = '(cql.allRecords=1) sortby name/sort.ascending';

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useGroups', () => {
  beforeEach(() => {
    useBuildQuery.mockReturnValue(jest.fn(() => queryMock));

    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => ({
            groups,
            totalRecords: groups.length,
          }),
        }),
      });
  });

  it('should return an empty list if there no filters were passed in the query', async () => {
    useLocation
      .mockClear()
      .mockReturnValue({ search: '' });

    const { result } = renderHook(() => useGroups({
      pagination: { limit: 5, offset: 0, timestamp: 42 },
    }), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(result.current).toEqual({
      groups: [],
      totalRecords: 0,
      isFetching: false,
    });
  });

  it('should return fetched fiscal years list', async () => {
    useLocation
      .mockClear()
      .mockReturnValue({ search: 'group' });

    const { result } = renderHook(() => useGroups({
      pagination: { limit: 5, offset: 0, timestamp: 42 },
    }), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(result.current).toEqual({
      groups,
      totalRecords: 1,
      isFetching: false,
    });
  });
});
