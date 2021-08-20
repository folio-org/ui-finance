import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';

import { useExportFund } from './useExportFund';

jest.mock('@folio/stripes-util/lib/exportCsv', () => jest.fn());

const code = 'FY2021';
const mockGet = jest.fn();

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useExportFund', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
    });
  });

  it('should make request', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useExportFund(code), { wrapper });

    result.current.fetchExportFund();
    await waitForNextUpdate();

    expect(mockGet).toHaveBeenCalled();
  });
});
