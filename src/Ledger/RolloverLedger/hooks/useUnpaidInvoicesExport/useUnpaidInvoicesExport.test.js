import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook, act } from '@testing-library/react-hooks';

import { exportToCsv } from '@folio/stripes/components';
import { useOkapiKy } from '@folio/stripes/core';

import { useUnpaidInvoicesExport } from './useUnpaidInvoicesExport';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  exportToCsv: jest.fn(),
}));

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useUnpaidInvoicesExport', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => ({}),
        }),
      });
  });

  it('should return a function, that run export to csv', async () => {
    const { result } = renderHook(
      () => useUnpaidInvoicesExport(),
      { wrapper },
    );

    await act(async () => result.current.runExportCSV({ query: '' }));

    expect(exportToCsv).toHaveBeenCalled();
  });
});
