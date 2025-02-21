import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  act,
  renderHook,
} from '@folio/jest-config-stripes/testing-library/react';
import { useShowCallout } from '@folio/stripes-acq-components';

import { BATCH_ALLOCATIONS_SOURCE } from '../../../../common/const';
import {
  fetchFinanceData,
  resolveSourceQueryIndex,
} from '../../../../common/utils';
import { useBatchAllocationMutation } from '../useBatchAllocationMutation';
import { useBatchAllocationFormHandler } from './useBatchAllocationFormHandler';

jest.mock('@folio/stripes-acq-components', () => ({
  useShowCallout: jest.fn(),
}));
jest.mock('../useBatchAllocationMutation', () => ({
  useBatchAllocationMutation: jest.fn(),
}));
jest.mock('../../../../common/utils', () => ({
  fetchFinanceData: jest.fn(),
  resolveSourceQueryIndex: jest.fn(),
}));

const wrapper = ({ children }) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
);

describe('useBatchAllocationFormHandler', () => {
  const showCalloutMock = jest.fn();
  const batchAllocateMock = jest.fn();
  const fetchFinanceDataMock = jest.fn();
  const resolveSourceQueryIndexMock = jest.fn();

  beforeEach(() => {
    useShowCallout.mockReturnValue(showCalloutMock);
    useBatchAllocationMutation.mockReturnValue({ batchAllocate: batchAllocateMock });
    fetchFinanceData.mockReturnValue(fetchFinanceDataMock);
    resolveSourceQueryIndex.mockReturnValue(resolveSourceQueryIndexMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle batch allocation successfully', async () => {
    const { result } = renderHook(() => useBatchAllocationFormHandler(), { wrapper });

    const fyFinanceData = [{ fiscalYearId: 'fy1' }];
    const initialValues = { fyFinanceData: [{ budgetId: 'b1' }] };
    const sourceId = 'source1';
    const sourceType = BATCH_ALLOCATIONS_SOURCE.ledger;

    batchAllocateMock.mockResolvedValueOnce();
    fetchFinanceDataMock.mockResolvedValueOnce({
      fyFinanceData: [
        { budgetId: 'b1' },
        { budgetId: 'b2' },
      ],
    });

    await act(async () => {
      await result.current.handle({
        fyFinanceData,
        initialValues,
        sourceId,
        sourceType,
      });
    });

    expect(batchAllocateMock).toHaveBeenCalledWith({ fyFinanceData });
    expect(showCalloutMock).toHaveBeenCalledWith({ messageId: 'ui-finance.actions.allocations.batch.success' });
    expect(fetchFinanceDataMock).toHaveBeenCalled();
    expect(showCalloutMock).toHaveBeenCalledWith({ messageId: 'ui-finance.budget.batch.create.success' });
  });

  it('should handle batch allocation error', async () => {
    const { result } = renderHook(() => useBatchAllocationFormHandler(), { wrapper });

    const fyFinanceData = [{ fiscalYearId: 'fy1' }];
    const initialValues = { fyFinanceData: [{ budgetId: 'b1' }] };
    const sourceId = 'source1';
    const sourceType = BATCH_ALLOCATIONS_SOURCE.group;

    batchAllocateMock.mockRejectedValueOnce();

    await act(async () => {
      await result.current.handle({
        fyFinanceData,
        initialValues,
        sourceId,
        sourceType,
      });
    });

    expect(batchAllocateMock).toHaveBeenCalledWith({ fyFinanceData });
    expect(showCalloutMock).toHaveBeenCalledWith({
      messageId: 'ui-finance.actions.allocations.batch.error',
      type: 'error',
    });
  });

  it('should handle fetch finance data error', async () => {
    const { result } = renderHook(() => useBatchAllocationFormHandler(), { wrapper });

    const fyFinanceData = [{ fiscalYearId: 'fy1' }];
    const initialValues = { fyFinanceData: [{ budgetId: 'b1' }] };
    const sourceId = 'source1';
    const sourceType = BATCH_ALLOCATIONS_SOURCE.group;

    batchAllocateMock.mockResolvedValueOnce();
    fetchFinanceDataMock.mockRejectedValueOnce();

    await act(async () => {
      await result.current.handle({
        fyFinanceData,
        initialValues,
        sourceId,
        sourceType,
      });
    });

    expect(batchAllocateMock).toHaveBeenCalledWith({ fyFinanceData });
    expect(showCalloutMock).toHaveBeenCalledWith({ messageId: 'ui-finance.actions.allocations.batch.success' });
    expect(fetchFinanceDataMock).toHaveBeenCalled();
    expect(showCalloutMock).toHaveBeenCalledWith({
      messageId: 'ui-finance.budget.actions.load.error',
      type: 'error',
    });
  });
});
