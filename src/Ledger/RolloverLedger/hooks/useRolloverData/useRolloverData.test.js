import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { useRolloverData } from './useRolloverData';

const mutatorMock = {
  funds: {
    GET: jest.fn(),
    reset: jest.fn(),
  },
  fundTypes: {
    GET: jest.fn(() => [{
      id: 'fundTypeId',
    }]),
    reset: jest.fn(),
  },
  currentBudgets: {
    GET: jest.fn(),
    reset: jest.fn(),
  },
  ledgerCurrentFiscalYear: {
    GET: jest.fn(),
    reset: jest.fn(),
  },
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
    mutatorMock.funds.GET.mockClear().mockReturnValue(Promise.resolve([{ id: 'fundId', fundTypeId: 'fundTypeId' }]));
    mutatorMock.ledgerCurrentFiscalYear.GET.mockClear().mockReturnValue(Promise.resolve({ id: 'fyId' }));

    renderHook(() => useRolloverData(mutatorMock), { wrapper });

    expect(mutatorMock.funds.GET).toHaveBeenCalled();
    expect(mutatorMock.ledgerCurrentFiscalYear.GET).toHaveBeenCalled();
  });
});
