import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';

import { useFundGroupMutation } from '../useFundGroupMutation';
import { useFundsGroupMutation } from './useFundsGroupMutation';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
}));
jest.mock('../useFundGroupMutation', () => ({
  useFundGroupMutation: jest.fn(),
}));

const fund = { id: 'fundId' };

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useFundsGroupMutation', () => {
  it('should update group funds', async () => {
    const mutateFundGroup = jest.fn();

    useFundGroupMutation.mockClear().mockReturnValue({ mutateFundGroup });

    const { result } = renderHook(() => useFundsGroupMutation(), { wrapper });

    await result.current.mutateFundsGroup([fund], () => {});

    expect(mutateFundGroup).toHaveBeenCalled();
  });
});
