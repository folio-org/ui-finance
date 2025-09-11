import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import {
  GROUP_FUND_FISCAL_YEARS_API,
  GROUP_SUMMARIES_API,
  GROUPS_API,
} from '../../common/const';
import { useRelatedGroups } from './useRelatedGroups';

const groups = [{ id: 'groupId' }];

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const kyMock = {
  extend: jest.fn(() => kyMock),
  get: jest.fn((url) => ({
    json: () => {
      return Promise.resolve({
        [GROUP_FUND_FISCAL_YEARS_API]: { groupFundFiscalYears: [{ groupId: 'groupId' }] },
        [GROUPS_API]: { groups },
        [GROUP_SUMMARIES_API]: { groupFiscalYearSummaries: [{ groupId: 'groupId' }] },
      }[url]);
    },
  })),
};

describe('useRelatedGroups', () => {
  beforeEach(() => {
    useOkapiKy.mockReturnValue(kyMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should ledger related groups data', async () => {
    const params = {
      fundIds: ['fundId'],
      fiscalYearId: 'fiscalYearId',
      ledgerId: 'ledgerId',
    };

    const { result } = renderHook(() => useRelatedGroups(params), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(result.current.groups).toEqual(groups);
  });
});
