import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useLedgers } from './useLedgers';

const queryClient = new QueryClient();

const ledgers = [
  {
    id: '133a7916-f05e-4df4-8f7f-09eb2a7076d1',
    _version: 1,
    name: 'One-time',
    code: 'ONETIME',
    description: 'Funds used for any non-recurring purchases',
    fiscalYearOneId: '7a4c4d30-3b63-4102-8e2d-3ee5792d7d02',
    ledgerStatus: 'Active',
    currency: 'USD',
    acqUnitIds: [],
    restrictEncumbrance: false,
    restrictExpenditures: false,
    metadata: {
      createdDate: '2025-02-20T01:53:25.355+00:00',
      updatedDate: '2025-02-20T01:53:25.355+00:00',
    },
  },
];

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useLedgers', () => {
  it('should fetch ledgers', async () => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => ({ ledgers, totalRecords: ledgers.length }),
        }),
      });

    const { result } = renderHook(() => useLedgers(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.ledgers).toEqual(ledgers);
  });
});
