import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import {
  useRolloverFiscalYears,
} from './useRolloverFiscalYears';

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useRolloverFiscalYears', () => {
  it('should return undefined if called without series', async () => {
    const { result } = renderHook(() => useRolloverFiscalYears(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.fiscalYears).toBeUndefined();
  });

  it('should return response array', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({
          fiscalYears: [{ id: 'fyId' }],
        }),
      }),
    });

    const { result } = renderHook(() => useRolloverFiscalYears('FY'), { wrapper });

    await waitFor(() => expect(result.current.fiscalYears).toBeTruthy());

    expect(result.current.fiscalYears.length).toEqual(1);
  });
});
