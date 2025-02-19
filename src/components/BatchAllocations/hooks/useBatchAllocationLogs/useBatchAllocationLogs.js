import { useQuery } from 'react-query';
import { useLocation } from 'react-router';
import queryString from 'query-string';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { LIMIT_MAX } from '@folio/stripes-acq-components';

import { FUND_UPDATE_LOGS_API } from '../../../../common/const';
import { useBuildQuery } from '../useBuildQuery';

const DEFAULT_LOGS = [];

export const useBatchAllocationLogs = (options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'fund-update-logs' });

  const { search } = useLocation();
  const buildQuery = useBuildQuery();
  const queryParams = queryString.parse(search);
  const query = buildQuery(queryParams);

  const searchParams = {
    limit: LIMIT_MAX,
    query,
  };

  const {
    data,
    isFetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [namespace, searchParams.limit, searchParams.query],
    queryFn: ({ signal }) => ky.get(FUND_UPDATE_LOGS_API, { searchParams, signal }).json(),
    enabled,
    ...queryOptions,
  });

  return ({
    data: data?.fundUpdateLogs || DEFAULT_LOGS,
    totalRecords: data?.totalRecords || 0,
    isFetching,
    isLoading,
    refetch,
  });
};
