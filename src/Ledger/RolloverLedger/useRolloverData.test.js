import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useRolloverData } from './useRolloverData';

const mutatorMock = {
  funds: { GET: jest.fn() },
  ledgerCurrentFiscalYear: { GET: jest.fn() },
};

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useRolloverData', () => {
  it('should call API', () => {
    renderHook(() => useRolloverData(mutatorMock), { wrapper });

    expect(mutatorMock.funds.GET).toHaveBeenCalled();
    expect(mutatorMock.ledgerCurrentFiscalYear.GET).toHaveBeenCalled();
  });
});
