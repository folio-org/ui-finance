import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';
import {
  INVOICES_API,
  VENDORS_API,
} from '@folio/stripes-acq-components';

import { useUnpaidInvoices } from './useUnpaidInvoices';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useNamespace: () => ['namespace'],
  useOkapiKy: jest.fn(),
}));

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const vendor = {
  id: 'vendorId',
  name: 'Amazon',
};

const invoices = [{
  id: 'invoiceId',
  vendorId: vendor.id,
}];

const KY_RESPONSE_DATA_MAP = {
  [INVOICES_API]: {
    invoices,
    totalRecords: invoices.length,
  },
  [VENDORS_API]: {
    organizations: [vendor],
  },
};

describe('useUnpaidInvoices', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: (path) => ({
          json: () => Promise.resolve(KY_RESPONSE_DATA_MAP[path]),
        }),
      });
  });

  it('should return fetched hydrated invoices', async () => {
    const { result } = renderHook(() => useUnpaidInvoices({
      periodStart: '2021-01-01T00:00:00.000+00:00',
      periodEnd: '2021-12-31T00:00:00.000+00:00',
    }), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(result.current.invoices).toEqual([{ ...invoices[0], vendor }]);
  });
});
