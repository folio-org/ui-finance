import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { LIMIT_MAX } from '@folio/stripes-acq-components';

import { FUND_UPDATE_LOGS_API } from '../../../../common/const';

const DEFAULT_LOGS = [];

export const useBatchAllocationLogs = (options = {}) => {
  const query = 'cql.allRecords=1 sortby metadata.createdDate/sort.descending';
  const limit = LIMIT_MAX;

  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'budgets-funds' });

  const searchParams = {
    limit,
    query,
  };

  const {
    data,
    isFetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [namespace, query, limit],
    queryFn: ({ signal }) => ky.get(FUND_UPDATE_LOGS_API, { searchParams, signal }).json(),
    enabled,
    ...queryOptions,
  });

  return ({
    data: data?.fundUpdateLogs || DEFAULT_LOGS,
    totalRecords: data?.totalRecords,
    isFetching,
    isLoading,
    refetch,
  });
};
