import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useFiscalYearOptions } from './useFiscalYearOptions';

const code = 'FY2021';

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useFiscalYearsOptions', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({ fiscalYears: [{ code }] }),
      }),
    });
  });

  it('should return fiscal years options', async () => {
    const { result } = renderHook(() => useFiscalYearOptions(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.fiscalYearOptions[0].value).toEqual(code);
    expect(result.current.fiscalYearOptions[0].label).toEqual(code);
  });
});
