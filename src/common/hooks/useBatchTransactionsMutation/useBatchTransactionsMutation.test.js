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
  BATCH_TRANSACTION_TYPES,
  BATCH_TRANSACTIONS_API,
} from '../../const';
import { useBatchTransactionsMutation } from './useBatchTransactionsMutation';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
}));

const transaction = {
  id: 'transactionId',
  amount: 10,
  currency: 'USD',
  fromFundId: 'fromFundId',
  toFundId: 'toFundId',
};

const transactionRequest = {
  transactionType: BATCH_TRANSACTION_TYPES.transactionsToCreate,
  data: [transaction],
};
const postMock = jest.fn(() => ({ json: jest.fn() }));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useBatchTransactionsMutation', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({ post: postMock });
  });

  it('should call batch transactions API', async () => {
    const { result } = renderHook(() => useBatchTransactionsMutation(), { wrapper });

    await result.current.batchTransactions(transactionRequest);

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(postMock)
      .toHaveBeenCalledWith(
        BATCH_TRANSACTIONS_API,
        {
          json: {
            transactionsToCreate: transactionRequest.data,
          },
        },
      );
  });
});
