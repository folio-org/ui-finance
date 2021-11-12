import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { useFund } from './useFund';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useNamespace: () => ['namespace'],
  useOkapiKy: jest.fn(),
}));

const fund = {
  fund: { id: 'fundId' },
  groupIds: ['groupId'],
};

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useFund', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => fund,
        }),
      });
  });

  it('should return fetched composite fund', async () => {
    const { result, waitFor } = renderHook(() => useFund(), { wrapper });

    const { data } = await result.current.fetchFund();

    await waitFor(() => !result.current.isLoading);

    expect(data.groupIds.length).toEqual(fund.groupIds.length);
  });
});
