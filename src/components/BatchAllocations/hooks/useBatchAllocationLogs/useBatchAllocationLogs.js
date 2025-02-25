import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { LIMIT_MAX } from '@folio/stripes-acq-components';

import { FUND_UPDATE_LOGS_API } from '../../../../common/const';
import { useBuildQuery } from '../useBuildQuery';
import { dehydrateAllocationLog } from '../../utils';

const DEFAULT_LOGS = [];

export const useBatchAllocationLogs = ({ filters }, options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'fund-update-logs' });

  const buildQuery = useBuildQuery();
  const query = buildQuery(filters);

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
    queryFn: async ({ signal }) => {
      const { totalRecords, fundUpdateLogs = [] } = await ky.get(FUND_UPDATE_LOGS_API, { searchParams, signal }).json();

      return {
        fundUpdateLogs: fundUpdateLogs.map(dehydrateAllocationLog),
        totalRecords,
      };
    },
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
