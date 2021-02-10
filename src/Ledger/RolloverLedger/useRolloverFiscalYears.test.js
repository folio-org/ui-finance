import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

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
    const { result, waitFor } = renderHook(() => useRolloverFiscalYears(), { wrapper });

    await waitFor(() => {
      return !result.current.isLoading;
    });

    expect(result.current.fiscalYears).toBeUndefined();
  });

  xit('should return response array', async () => {
    useOkapiKy.mockClear().mockReturnValue(() => {
      return ({
        json: () => {
          return {
            data: { fiscalYears: [{ id: 'fyId' }] },
          };
        },
      });
    });

    const { result, waitFor } = renderHook(() => useRolloverFiscalYears('FY'), { wrapper });

    await waitFor(() => {
      return Boolean(result.current.fiscalYears);
    });

    expect(result.current.fiscalYears.length).toEqual(1);
  });
});
