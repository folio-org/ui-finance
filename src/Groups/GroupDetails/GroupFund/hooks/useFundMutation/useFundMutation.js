import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { FUNDS_API } from '@folio/stripes-acq-components';

export const useFundMutation = (options = {}) => {
  const ky = useOkapiKy();

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (fund) => {
      return ky.put(`${FUNDS_API}/${fund.fund.id}`, { json: fund });
    },
    ...options,
  });

  return {
    mutateFund: mutateAsync,
    isLoading,
  };
};
