import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { LEDGERS_API } from '../../const';

export const useLedger = (ledgerId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'ledger' });

  const {
    data = {},
    isFetching,
    isLoading,
  } = useQuery(
    [namespace, ledgerId],
    async () => ky.get(`${LEDGERS_API}/${ledgerId}`).json(),
    {
      enabled: Boolean(ledgerId),
    },
  );

  return ({
    ledger: data,
    isFetching,
    isLoading,
  });
};
