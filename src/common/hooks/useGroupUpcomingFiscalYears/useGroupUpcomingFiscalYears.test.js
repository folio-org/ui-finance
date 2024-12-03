import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import {
  getGroupLedgers,
  getLedgersCurrentFiscalYears,
} from '../../../Groups/GroupDetails/utils';
import { FISCAL_YEARS_API } from '../../const';
import { useGroupUpcomingFiscalYears } from './useGroupUpcomingFiscalYears';

jest.mock('../../../Groups/GroupDetails/utils', () => ({
  getGroupLedgers: jest.fn(),
  getLedgersCurrentFiscalYears: jest.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useGroupUpcomingFiscalYears', () => {
  const kyMock = {
    get: jest.fn(() => ({
      json: jest.fn().mockResolvedValue({ fiscalYears: [], totalRecords: 0 }),
    })),
    extend: jest.fn(() => kyMock),
  };

  beforeEach(() => {
    useOkapiKy.mockReturnValue(kyMock);
    getGroupLedgers.mockReturnValue(() => Promise.resolve({ ledgers: [{ id: 'ledger1' }] }));
    getLedgersCurrentFiscalYears.mockReturnValue(() => Promise.resolve([{ series: 'FY', periodStart: '2022-01-01' }]));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return default data when groupId is not provided', async () => {
    const { result } = renderHook(() => useGroupUpcomingFiscalYears(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.fiscalYears).toEqual([]);
    expect(result.current.totalRecords).toBeUndefined();
  });

  it('should fetch and return fiscal years data', async () => {
    const { result } = renderHook(() => useGroupUpcomingFiscalYears('groupId'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.fiscalYears).toEqual([]);
    expect(result.current.totalRecords).toBe(0);
    expect(kyMock.get).toHaveBeenCalledWith(FISCAL_YEARS_API, expect.any(Object));
  });
});
