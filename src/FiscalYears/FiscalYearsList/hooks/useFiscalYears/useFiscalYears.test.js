import { useLocation } from 'react-router';
import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useBuildQuery } from '../useBuildQuery';
import { useFiscalYears } from './useFiscalYears';

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

const fiscalYears = [{ code: 'fy' }];
const queryMock = '(cql.allRecords=1) sortby name/sort.ascending';

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useFiscalYears', () => {
  beforeEach(() => {
    useBuildQuery.mockReturnValue(jest.fn(() => queryMock));

    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => ({
            fiscalYears,
            totalRecords: fiscalYears.length,
          }),
        }),
      });
  });

  it('should return fetched fiscal years by default', async () => {
    useLocation
      .mockClear()
      .mockReturnValue({ search: '' });

    const { result } = renderHook(() => useFiscalYears({
      pagination: { limit: 5, offset: 0, timestamp: 42 },
    }), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(result.current.totalRecords).toEqual(fiscalYears.length);
  });

  it('should return fetched fiscal years list', async () => {
    useLocation
      .mockClear()
      .mockReturnValue({ search: 'fy' });

    const { result } = renderHook(() => useFiscalYears({
      pagination: { limit: 5, offset: 0, timestamp: 42 },
    }), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(result.current).toEqual({
      fiscalYears,
      totalRecords: 1,
      isFetching: false,
    });
  });
});
