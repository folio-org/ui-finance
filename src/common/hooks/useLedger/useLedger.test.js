import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { LEDGERS_API } from '../../const';
import { useLedger } from './useLedger';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const ledger = {
  id: 'ledgerId',
  name: 'ledgerName',
};

describe('useLedger', () => {
  const mockGet = jest.fn(() => ({
    json: () => Promise.resolve(ledger),
  }));

  beforeEach(() => {
    mockGet.mockClear();
    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
    });
  });

  it('should fetch ledger data by id', async () => {
    const { result } = renderHook(() => useLedger(ledger.id), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(mockGet).toHaveBeenCalledWith(`${LEDGERS_API}/${ledger.id}`, expect.objectContaining({}));
    expect(result.current.ledger).toEqual(ledger);
  });
});
