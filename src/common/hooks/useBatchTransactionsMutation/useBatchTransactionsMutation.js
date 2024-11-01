import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import {
  BATCH_TRANSACTION_TYPES,
  BATCH_TRANSACTIONS_API,
} from '../../const';

export const useBatchTransactionsMutation = (options = {}) => {
  const ky = useOkapiKy();

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: async ({ transactionType = BATCH_TRANSACTION_TYPES.transactionsToCreate, data = [] }) => {
      const requestData = { [transactionType]: data };
      const transactionsResponse = await ky.post(`${BATCH_TRANSACTIONS_API}`, { json: requestData }).json();

      return transactionsResponse;
    },
    ...options,
  });

  return {
    batchTransactions: mutateAsync,
    isLoading,
  };
};
