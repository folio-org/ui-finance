import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useSourceLink } from './useSourceLink';

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useSourceValue', () => {
  it('should not return pol link', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({
          data: 'poLineNumber',
        }),
      }),
    });

    const { result } = renderHook(() => useSourceLink(
      { source: 'PoLine', encumbrance: { sourcePoLineId: 'id' } },
      { formattedMessage: jest.fn() },
    ), { wrapper });

    await waitFor(() => expect(result.current).toBeTruthy());

    expect(result.current).toBeTruthy();
  });
});
