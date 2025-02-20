import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useGroups } from './useGroups';

const queryClient = new QueryClient();

const groups = [
  {
    id: 'f33ed99b-852a-4f90-9891-5efe0feab165',
    _version: 1,
    acqUnitIds: [],
    code: 'HIST',
    description: 'History is an umbrella term that relates to past events as well as the memory, discovery, collection, organization, presentation, and interpretation of information about these events.',
    name: 'History',
    status: 'Active',
    metadata: {
      createdDate: '2025-02-20T01:53:25.248+00:00',
      updatedDate: '2025-02-20T01:53:25.248+00:00',
    },
  },
];

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useGroups', () => {
  it('should fetch groups', async () => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => ({ groups, totalRecords: groups.length }),
        }),
      });

    const { result } = renderHook(() => useGroups(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.groups).toEqual(groups);
  });
});
