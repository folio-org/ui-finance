import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { FINANCE_DATA_API } from '../../../../common/const';
import { useBatchAllocation } from './useBatchAllocation';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const fyFinanceData = [{
  fiscalYearId: '123e4567-e89b-12d3-a456-426614174004',
  fiscalYearCode: 'FY2023',
  fundId: '123e4567-e89b-12d3-a456-426614174000',
  fundCode: 'FND001',
  fundName: 'General Fund',
  fundDescription: 'This fund is used for general purposes.',
  fundStatus: 'Active',
  fundTags: {
    tagList: ['Education', 'Research'],
  },
  fundAcqUnitIds: ['123e4567-e89b-12d3-a456-426614174006'],
  ledgerId: '123e4567-e89b-12d3-a456-426614174015',
  ledgerCode: 'LED001',
  budgetId: '123e4567-e89b-12d3-a456-426614174001',
  budgetName: 'Annual Budget',
  budgetStatus: 'Active',
  budgetInitialAllocation: 1000000,
  budgetAllowableExpenditure: 80,
  budgetAllowableEncumbrance: 90,
  budgetAcqUnitIds: ['123e4567-e89b-12d3-a456-426614174008'],
  groupId: '123e4567-e89b-12d3-a456-426614174025',
  groupCode: 'GRP001',
}];
const kyMock = {
  get: jest.fn(() => ({
    json: () => Promise.resolve({ fyFinanceData }),
  })),
};

describe('useBatchAllocation', () => {
  beforeEach(() => {
    kyMock.get.mockClear();
    useOkapiKy.mockClear().mockReturnValue(kyMock);
  });

  it('should return array of fyFinanceData', async () => {
    const { result } = renderHook(() => useBatchAllocation(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(kyMock.get).toHaveBeenCalledWith(FINANCE_DATA_API, expect.objectContaining({}));
    expect(result.current.budgetsFunds).toEqual(fyFinanceData);
  });
});
