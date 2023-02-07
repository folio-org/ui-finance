import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

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
    const { result, waitFor } = renderHook(() => useLedgerRollover(rollover.id), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(result.current.rollover).toEqual(rollover);
    expect(mockGet).toHaveBeenCalledWith(`${LEDGER_ROLLOVER_API}/${rollover.id}`, expect.objectContaining({}));
  });
});
