import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

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
    const { result, waitFor } = renderHook(() => useBudgetsFiscalYears({
      series: 'FY',
      periodStart: '2022-03-10T13:39:07.657+00:00',
    }), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(result.current.fiscalYears).toEqual(fiscalYears);
  });
});
