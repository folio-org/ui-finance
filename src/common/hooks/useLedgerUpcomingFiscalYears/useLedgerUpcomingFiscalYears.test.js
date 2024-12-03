import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { FISCAL_YEARS_API } from '../../const';
import { useLedgerCurrentFiscalYear } from '../useLedgerCurrentFiscalYear';
import { useLedgerUpcomingFiscalYears } from './useLedgerUpcomingFiscalYears';

jest.mock('../useLedgerCurrentFiscalYear', () => ({
  useLedgerCurrentFiscalYear: jest.fn(),
}));

const currentFiscalYear = {
  id: 'fiscal-year-id',
  series: 'FY',
  periodStart: '2023-10-05T00:00:00Z',
};
const fiscalYears = [{ id: 'fy1' }, { id: 'fy2' }];

const kyMock = {
  get: jest.fn(() => ({
    json: () => Promise.resolve({ fiscalYears }),
  })),
};

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useLedgerUpcomingFiscalYears', () => {
  beforeEach(() => {
    useLedgerCurrentFiscalYear.mockReturnValue({ currentFiscalYear });
    useOkapiKy.mockReturnValue(kyMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch fiscal years for the ledger', async () => {
    const { result } = renderHook(() => useLedgerUpcomingFiscalYears('ledgerId'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(kyMock.get).toHaveBeenCalledWith(FISCAL_YEARS_API, {
      searchParams: expect.objectContaining({
        query: `series==${currentFiscalYear.series} and periodStart >= ${currentFiscalYear.periodStart} sortby periodStart/sort.descending series/sort.ascending`,
      }),
      signal: expect.any(AbortSignal),
    });
    expect(result.current.fiscalYears).toEqual(fiscalYears);
  });
});
