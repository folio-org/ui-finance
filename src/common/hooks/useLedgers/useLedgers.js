import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  ALL_RECORDS_CQL,
  LIMIT_MAX,
} from '@folio/stripes-acq-components';

import { LEDGERS_API } from '../../const';

const DEFAULT_DATA = [];

export const useLedgers = (params = {}, options = {}) => {
  const {
    query = ALL_RECORDS_CQL,
    offset = 0,
    limit = LIMIT_MAX,
  } = params;

  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const searchParams = {
    query,
    offset,
    limit,
  };

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'ledgers' });

  const {
    data,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [namespace, query, offset, limit, tenantId],
    queryFn: ({ signal }) => ky.get(LEDGERS_API, { searchParams, signal }).json(),
    enabled,
    ...queryOptions,
  });

  return {
    ledgers: data?.ledgers || DEFAULT_DATA,
    totalRecords: data?.totalRecords || 0,
    isFetching,
    isLoading,
  };
};
