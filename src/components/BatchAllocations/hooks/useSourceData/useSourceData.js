import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import {
  LEDGERS_API,
  GROUPS_API,
  BATCH_ALLOCATIONS_SOURCE,
} from '../../../../common/const';

export const useSourceData = (source, id, options = {}) => {
  const { enabled = true, ...queryOptions } = options;

  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: source });
  const api = source === BATCH_ALLOCATIONS_SOURCE.ledger ? LEDGERS_API : GROUPS_API;

  const {
    data = {},
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [namespace, id, api],
    queryFn: async ({ signal }) => ky.get(`${api}/${id}`, { signal }).json(),
    enabled: Boolean(enabled && id),
    ...queryOptions,
  });

  return ({
    data,
    isFetching,
    isLoading,
  });
};
