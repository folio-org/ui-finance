import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { hierarchyResponse } from 'fixtures';
import { FISCAL_YEAR_HIERARCHY_API } from '../../../common/const';
import { useBrowseHierarchy } from './useBrowseHierarchy';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const mockGet = jest.fn();

describe('useBrowseHierarchy', () => {
  beforeEach(() => {
    queryClient.clear();
    mockGet.mockClear().mockReturnValue({ json: jest.fn().mockResolvedValue(hierarchyResponse) });
    useOkapiKy.mockClear().mockReturnValue({ get: mockGet });
  });

  it('should request the hierarchy of the fiscal year', async () => {
    const { result } = renderHook(() => useBrowseHierarchy('fy-1'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockGet).toHaveBeenCalledWith(
      FISCAL_YEAR_HIERARCHY_API,
      expect.objectContaining({ searchParams: { fiscalYearId: 'fy-1' } }),
    );
  });

  it('should return the hierarchy built from the response', async () => {
    const { result } = renderHook(() => useBrowseHierarchy('fy-1'), { wrapper });

    await waitFor(() => expect(result.current.hierarchy).toHaveLength(2));

    expect(result.current.counts.ledgers).toBe(2);
    expect(result.current.keysByType.ledger).toEqual(['ledger-1', 'ledger-2']);
  });

  it('should not request anything without a fiscal year', () => {
    const { result } = renderHook(() => useBrowseHierarchy(undefined), { wrapper });

    expect(mockGet).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hierarchy).toEqual([]);
  });
});
