import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import {
  FUNDS_API,
} from '@folio/stripes-acq-components';

export const useFundGroupMutation = (options = {}) => {
  const ky = useOkapiKy();

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: async ({ fund, hydrate }) => {
      const fundToUpdate = await ky.get(`${FUNDS_API}/${fund.id}`).json();

      return ky.put(`${FUNDS_API}/${fund.id}`, { json: hydrate(fundToUpdate) });
    },
    ...options,
  });

  return {
    mutateFundGroup: mutateAsync,
    isLoading,
  };
};
