import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useLedgerCurrentFiscalYear } from './useLedgerCurrentFiscalYear';

const currentFY = { id: 'fiscal-year-id' };

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useLedgerCurrentFiscalYear', () => {
  it('should fetch current fiscal year for the ledger', async () => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => currentFY,
        }),
      });

    const { result } = renderHook(() => useLedgerCurrentFiscalYear('ledgerId'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.currentFiscalYear).toEqual(currentFY);
  });
});
