import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useBudgetByFundAndFY } from './useBudgetByFundAndFY';

const budgets = [{ id: '123', fundId: '456', fiscalYearId: '789', amount: 1000 }];

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useBudgetByFundAndFY', () => {
  it('should fetch budget based on fund ID and fiscal year ID', async () => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => ({
            budgets,
            totalRecords: budgets.length,
          }),
        }),
      });

    const { result } = renderHook(() => useBudgetByFundAndFY('456', '789'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.budget).toEqual(budgets[0]);
  });
});
