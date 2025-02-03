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

export const useSourceData = (source, id) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: source });
  const api = source === BATCH_ALLOCATIONS_SOURCE.ledger ? LEDGERS_API : GROUPS_API;

  const {
    data = {},
    isFetching,
    isLoading,
  } = useQuery(
    [namespace, id],
    async ({ signal }) => ky.get(`${api}/${id}`, { signal }).json(),
    {
      enabled: Boolean(id),
    },
  );

  return ({
    data,
    isFetching,
    isLoading,
  });
};
