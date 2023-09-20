import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';
import { FUNDS_API } from '@folio/stripes-acq-components';

import { useFundGroupMutation } from './useFundGroupMutation';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
}));

const fund = {
  fund: { id: 'fundId' },
  groupIds: ['groupId'],
};
const putMock = jest.fn();

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useFundGroupMutation', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => fund,
        }),
        put: putMock,
      });
  });

  it('should fetch composite fund and update it', async () => {
    const { result } = renderHook(() => useFundGroupMutation(), { wrapper });

    await result.current.mutateFundGroup({ fund: fund.fund, hydrate: (f) => f });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(putMock).toHaveBeenCalledWith(`${FUNDS_API}/${fund.fund.id}`, { 'json': fund });
  });
});
