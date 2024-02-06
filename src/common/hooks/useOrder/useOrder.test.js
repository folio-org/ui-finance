import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';
import { ORDER_STATUSES } from '@folio/stripes-acq-components';

import { useOrder } from './useOrder';

const queryClient = new QueryClient();

const order = {
  id: 'order-id',
  workflowStatus: ORDER_STATUSES.open,
};

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useOrder', () => {
  it('should fetch order by id', async () => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => order,
        }),
      });

    const { result } = renderHook(() => useOrder(order.id), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.order).toEqual(order);
  });
});
