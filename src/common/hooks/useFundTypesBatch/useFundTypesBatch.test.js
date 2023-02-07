import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';

import { FUND_TYPES_API } from '../../const';
import { useFundTypesBatch } from './useFundTypesBatch';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const fundTypes = [
  { id: '1', name: 'Approvals' },
  { id: '2', name: 'Faculty' },
];
const fundTypeIds = fundTypes.map(({ id }) => id);

describe('useFundTypesBatch', () => {
  const mockGet = jest.fn(() => ({
    json: () => Promise.resolve({ fundTypes }),
  }));

  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
    });
  });

  it('should batch fetch fund types by ids', async () => {
    const { result, waitFor } = renderHook(() => useFundTypesBatch(fundTypeIds), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(result.current.fundTypes).toEqual(fundTypes);
    expect(mockGet).toHaveBeenCalledWith(FUND_TYPES_API, expect.objectContaining({}));
  });
});
