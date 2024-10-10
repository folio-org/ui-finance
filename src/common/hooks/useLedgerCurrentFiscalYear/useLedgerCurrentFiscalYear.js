import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { LEDGERS_API } from '../../const';

export const useLedgerCurrentFiscalYear = (ledgerId, options = {}) => {
  const {
    enabled = true,
    ...queryOptions
  } = options;

  const ky = useOkapiKy();
  const [namespace] = useNamespace();

  const {
    data,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [namespace, ledgerId],
    queryFn: () => ky.get(`${LEDGERS_API}/${ledgerId}/current-fiscal-year`).json(),
    enabled: Boolean(enabled && ledgerId),
    ...queryOptions,
  });

  return ({
    currentFiscalYear: data,
    isFetching,
    isLoading,
  });
};
