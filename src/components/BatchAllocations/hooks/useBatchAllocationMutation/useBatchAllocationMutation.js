import { useCallback } from 'react';
import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { FINANCE_DATA_API } from '../../../../common/const';

const UPDATE_TYPE = {
  preview: 'Preview',
  commit: 'Commit',
};

export const useBatchAllocationMutation = () => {
  const ky = useOkapiKy();

  const {
    mutateAsync,
    isLoading,
  } = useMutation({
    mutationFn: async ({ fyFinanceData, updateType }) => {
      const json = {
        fyFinanceData,
        updateType,
        totalRecords: fyFinanceData.length,
      };

      return ky.put(FINANCE_DATA_API, { json });
    },
  });

  const recalculate = useCallback(({ fyFinanceData }) => mutateAsync({
    fyFinanceData,
    updateType: UPDATE_TYPE.preview,
  }), [mutateAsync]);

  const batchAllocate = useCallback(({ fyFinanceData }) => mutateAsync({
    fyFinanceData,
    updateType: UPDATE_TYPE.commit,
  }), [mutateAsync]);

  return {
    batchAllocate,
    recalculate,
    isLoading,
  };
};
