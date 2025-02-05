import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useSourceData } from './useSourceData';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const ledger = {
  id: 'ledgerId',
  name: 'ledgerName',
};

const group = {
  id: 'groupId',
  name: 'groupName',
};
const kyMock = {
  get: jest.fn((url) => ({
    json: () => Promise.resolve(url.includes('ledgers') ? ledger : group),
  })),
};

describe('useSourceData', () => {
  beforeEach(() => {
    kyMock.get.mockClear();
    useOkapiKy.mockClear().mockReturnValue(kyMock);
  });

  it('should return ledger by id', async () => {
    const { result } = renderHook(() => useSourceData('ledger', ledger.id), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(kyMock.get).toHaveBeenCalledWith(`finance/ledgers/${ledger.id}`, expect.objectContaining({}));
    expect(result.current.data).toEqual(ledger);
  });

  it('should return group by id', async () => {
    const { result } = renderHook(() => useSourceData('group', group.id), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(kyMock.get).toHaveBeenCalledWith(`finance/groups/${group.id}`, expect.objectContaining({}));
    expect(result.current.data).toEqual(group);
  });
});
