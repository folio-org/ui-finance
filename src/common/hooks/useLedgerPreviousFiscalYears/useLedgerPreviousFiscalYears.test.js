import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useFiscalYear } from '../useFiscalYear';
import { useLedgerCurrentFiscalYear } from '../useLedgerCurrentFiscalYear';
import { useLedgerPreviousFiscalYears } from './useLedgerPreviousFiscalYears';

jest.mock('../useFiscalYear', () => ({ useFiscalYear: jest.fn() }));
jest.mock('../useLedgerCurrentFiscalYear', () => ({ useLedgerCurrentFiscalYear: jest.fn() }));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const fiscalYear = { id: '2022', code: 'FY2022' };

const getMock = jest.fn(() => ({
  json: () => Promise.resolve({
    fiscalYears: [fiscalYear],
  }),
}));

describe('useLedgerPreviousFiscalYears', () => {
  beforeEach(() => {
    useFiscalYear.mockReturnValue({
      fiscalYear,
      isLoading: false,
    });
    useLedgerCurrentFiscalYear.mockReturnValue({
      currentFiscalYear: fiscalYear,
      isLoading: false,
    });
    useOkapiKy.mockReturnValue({ get: getMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return previous fiscal years', async () => {
    const ledger = {
      id: 'ledger-id',
      fiscalYearOneId: fiscalYear.id,
    };

    const { result } = renderHook(() => useLedgerPreviousFiscalYears(ledger, {
      onError: console.log
    }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(getMock).toHaveBeenCalled();
    expect(result.current.fiscalYears).toEqual([fiscalYear]);
  });
});
