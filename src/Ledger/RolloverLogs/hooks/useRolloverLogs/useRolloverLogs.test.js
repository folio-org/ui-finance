import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { RESULT_COUNT_INCREMENT } from '@folio/stripes-acq-components';

import { rolloverLogs } from '../../../../../test/jest/fixtures/rollover';
import { useRolloverLogs } from './useRolloverLogs';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(() => ({})),
}));
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

const ledgerId = '123';
const pagination = {
  limit: RESULT_COUNT_INCREMENT,
  offset: 0,
  timestamp: 12345,
};

describe('useRolloverLogs', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => Promise.resolve({
            rolloverLogs,
            totalRecords: rolloverLogs.length,
          }),
        }),
      });
  });

  it('should return fetched rollover logs', async () => {
    const { result, waitFor } = renderHook(() => useRolloverLogs({ ledgerId, pagination }), { wrapper });

    await waitFor(() => !result.current.isFetching);

    expect(result.current.rolloverLogs).toEqual(rolloverLogs);
  });
});
