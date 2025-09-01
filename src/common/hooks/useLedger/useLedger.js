import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { LEDGERS_API } from '../../const';

export const useLedger = (ledgerId, options = {}) => {
  const {
    enabled = true,
    fiscalYearId,
    tenantId,
    ...queryParams
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'ledger' });

  const {
    data = {},
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [namespace, ledgerId, fiscalYearId],
    queryFn: ({ signal }) => {
      const searchParams = fiscalYearId ? { fiscalYear: fiscalYearId } : undefined;

      return ky.get(`${LEDGERS_API}/${ledgerId}`, { searchParams, signal }).json();
    },
    enabled: enabled && Boolean(ledgerId),
    ...queryParams,
  });

  return ({
    ledger: data,
    isFetching,
    isLoading,
  });
};
