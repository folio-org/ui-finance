import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { LEDGER_ROLLOVER_API } from '../../const';
import { useLedgerRollover } from './useLedgerRollover';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const rollover = {
  id: 'rollover-id',
};

describe('useLedgerRollover', () => {
  const mockGet = jest.fn(() => ({
    json: () => Promise.resolve(rollover),
  }));

  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
    });
  });

  it('should fetch rollover data by id', async () => {
    const { result } = renderHook(() => useLedgerRollover(rollover.id), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.rollover).toEqual(rollover);
    expect(mockGet).toHaveBeenCalledWith(`${LEDGER_ROLLOVER_API}/${rollover.id}`, expect.objectContaining({}));
  });
});
