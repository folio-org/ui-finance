import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';

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
    const { result, waitFor } = renderHook(() => useLedger(ledger.id), { wrapper });

    await waitFor(() => !result.current.isFetching);

    expect(mockGet).toHaveBeenCalledWith(`${LEDGERS_API}/${ledger.id}`);
    expect(result.current.ledger).toEqual(ledger);
  });
});
