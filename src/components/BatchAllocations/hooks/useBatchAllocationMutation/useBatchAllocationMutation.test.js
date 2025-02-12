import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { FINANCE_DATA_API } from '../../../../common/const';
import { useBatchAllocationMutation } from './useBatchAllocationMutation';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useBatchAllocationMutation', () => {
  const kyMock = {
    put: jest.fn(() => ({
      json: jest.fn().mockResolvedValue({}),
    })),
  };

  beforeEach(() => {
    useOkapiKy.mockReturnValue(kyMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call ky.put with correct parameters for recalculate', async () => {
    const { result } = renderHook(() => useBatchAllocationMutation(), { wrapper });

    const fyFinanceData = [{ id: 1 }, { id: 2 }];

    await result.current.recalculate({ fyFinanceData });

    expect(kyMock.put).toHaveBeenCalledWith(FINANCE_DATA_API, {
      json: {
        fyFinanceData,
        updateType: 'Preview',
        totalRecords: fyFinanceData.length,
      },
    });
  });

  it('should call ky.put with correct parameters for batchAllocate', async () => {
    const { result } = renderHook(() => useBatchAllocationMutation(), { wrapper });

    const fyFinanceData = [{ id: 1 }, { id: 2 }];

    await result.current.batchAllocate({ fyFinanceData });

    expect(kyMock.put).toHaveBeenCalledWith(FINANCE_DATA_API, {
      json: {
        fyFinanceData,
        updateType: 'Commit',
        totalRecords: fyFinanceData.length,
      },
    });
  });
});
