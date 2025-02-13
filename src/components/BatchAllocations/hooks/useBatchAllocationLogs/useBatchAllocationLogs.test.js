import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { FUND_UPDATE_LOGS_API } from '../../../../common/const';
import { useBatchAllocationLogs } from './useBatchAllocationLogs';

const queryClient = new QueryClient();

const logs = [{
  jobNumber: 1,
  jobName: 'Job Name 1',
  jobDetails: {},
  status: 'IN_PROGRESS',
  recordsCount: 1,
  metadata: {
    createdDate: '2025-02-10T01:54:30.162+00:00',
    updatedDate: '2025-02-10T01:54:30.162+00:00',
  },
},
{
  jobNumber: 2,
  jobName: 'Job Name 2',
  jobDetails: {},
  status: 'IN_PROGRESS',
  recordsCount: 2,
  metadata: {
    createdDate: '2025-02-10T01:54:30.162+00:00',
    updatedDate: '2025-02-10T01:54:30.162+00:00',
  },
}];

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const kyMock = {
  get: jest.fn(() => ({
    json: () => Promise.resolve({ data: logs, totalRecords: logs.length }),
  })),
};

describe('useBatchAllocationLogs', () => {
  beforeEach(() => {
    kyMock.get.mockClear();
    useOkapiKy.mockReturnValue(kyMock);
  });

  it('should call logs api endpoint', async () => {
    const { result } = renderHook(() => useBatchAllocationLogs(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(kyMock.get).toHaveBeenCalledWith(FUND_UPDATE_LOGS_API, expect.objectContaining({}));
  });
});
