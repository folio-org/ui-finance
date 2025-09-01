import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useLedgerFunds } from './useLedgerFunds';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const fund = { id: '001', code: 'FUNDCODE' };

describe('useLedgerFunds', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return funds', async () => {
    useOkapiKy.mockReturnValue({
      get: () => ({
        json: () => ({
          funds: [fund],
        }),
      }),
    });

    const { result } = renderHook(() => useLedgerFunds('ledgerId'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.funds.length).toEqual(1);
  });
});
