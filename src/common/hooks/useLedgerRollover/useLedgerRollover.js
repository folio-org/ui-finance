import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { LEDGER_ROLLOVER_API } from '../../const';

export const useLedgerRollover = (rolloverId, options = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'ledger-rollover' });

  const {
    data = {},
    isLoading,
  } = useQuery(
    [namespace, rolloverId],
    async ({ signal }) => ky.get(`${LEDGER_ROLLOVER_API}/${rolloverId}`, { signal }).json(),
    {
      enabled: Boolean(rolloverId),
      ...options,
    },
  );

  return {
    rollover: data,
    isLoading,
  };
};
