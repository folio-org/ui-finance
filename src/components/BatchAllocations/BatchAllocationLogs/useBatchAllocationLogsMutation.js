import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { FUND_UPDATE_LOGS_API } from '../../../common/const';

export const useBatchAllocationLogsMutation = (options = {}) => {
  const { tenantId } = options;

  const ky = useOkapiKy({ tenant: tenantId });

  const deleteMutationFn = (logId) => {
    return ky.delete(`${FUND_UPDATE_LOGS_API}/${logId}`);
  };

  const { mutateAsync: deleteLog, isLoading: isDeleting } = useMutation({ mutationFn: deleteMutationFn });

  return {
    deleteLog,
    isDeleting,
  };
};
