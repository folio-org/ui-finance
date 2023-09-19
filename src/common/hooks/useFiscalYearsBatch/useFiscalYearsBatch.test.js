import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { FISCAL_YEARS_API } from '../../const';
import { useFiscalYearsBatch } from './useFiscalYearsBatch';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const fiscalYears = [
  { id: '1', code: 'FY2023', periodStart: '2023-01-01T00:00:00.000+00:00', periodEnd: '2023-12-31T23:59:59.000+00:00' },
  { id: '2', code: 'FY2024', periodStart: '2024-01-01T00:00:00.000+00:00', periodEnd: '2024-12-31T23:59:59.000+00:00' },
];
const fiscalYearIds = fiscalYears.map(({ id }) => id);

describe('useFiscalYearsBatch', () => {
  const mockGet = jest.fn(() => ({
    json: () => Promise.resolve({ fiscalYears }),
  }));

  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
    });
  });

  it('should batch fetch fiscal years by ids', async () => {
    const { result } = renderHook(() => useFiscalYearsBatch(fiscalYearIds), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.fiscalYears).toEqual(fiscalYears);
    expect(mockGet).toHaveBeenCalledWith(FISCAL_YEARS_API, expect.objectContaining({}));
  });
});
