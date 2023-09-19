import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useBudgetsFiscalYears } from './useBudgetsFiscalYears';

const fiscalYears = [{ code: 'fy' }];

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useBudgetsFiscalYears', () => {
  beforeEach(() => {
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

  it('should return fetched fiscal years', async () => {
    const { result } = renderHook(() => useBudgetsFiscalYears({
      series: 'FY',
      periodStart: '2022-03-10T13:39:07.657+00:00',
    }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.fiscalYears).toEqual(fiscalYears);
  });
});
