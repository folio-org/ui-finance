import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  CQLBuilder,
  FUNDS_API,
  LIMIT_MAX,
} from '@folio/stripes-acq-components';

const DEFAULT_DATA = [];

export const useLedgerFunds = (ledgerId, options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'funds' });

  const cqlBuilder = new CQLBuilder();
  const searchParams = {
    limit: LIMIT_MAX,
    query: (
      cqlBuilder
        .equal('ledgerId', ledgerId)
        .sortBy('name')
        .build()
    ),
  };

  const {
    data,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [namespace, ledgerId, tenantId],
    queryFn: ({ signal }) => ky.get(FUNDS_API, { searchParams, signal }).json(),
    enabled,
    ...queryOptions,
  });

  return ({
    funds: data?.funds || DEFAULT_DATA,
    totalRecords: data?.totalRecords,
    isFetching,
    isLoading,
  });
};
