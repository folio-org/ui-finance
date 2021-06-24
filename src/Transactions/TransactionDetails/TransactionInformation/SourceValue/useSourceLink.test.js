import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

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

    const { result, waitFor } = renderHook(() => useSourceLink(
      { source: 'PoLine', encumbrance: { sourcePoLineId: 'id' } },
      { formattedMessage: jest.fn() },
    ), { wrapper });

    await waitFor(() => {
      return Boolean(result.current);
    });

    expect(result.current).toBeTruthy();
  });
});
