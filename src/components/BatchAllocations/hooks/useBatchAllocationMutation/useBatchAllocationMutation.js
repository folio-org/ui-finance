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
    mutationFn: async ({ fyFinanceData, updateType, worksheetName }) => {
      const json = {
        fyFinanceData,
        updateType,
        totalRecords: fyFinanceData.length,
        worksheetName,
      };

      return ky.put(FINANCE_DATA_API, { json }).json();
    },
  });

  const recalculate = useCallback(({ fyFinanceData }) => mutateAsync({
    fyFinanceData,
    updateType: UPDATE_TYPE.preview,
  }), [mutateAsync]);

  const batchAllocate = useCallback(({ fyFinanceData, worksheetName }) => mutateAsync({
    fyFinanceData,
    updateType: UPDATE_TYPE.commit,
    worksheetName,
  }), [mutateAsync]);

  return {
    batchAllocate,
    recalculate,
    isLoading,
  };
};
