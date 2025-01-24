import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { LIMIT_MAX } from '@folio/stripes-acq-components';

import { FINANCE_DATA_API } from '../../common/const';

const DEFAULT_DATA = [];

export const useBatchAllocation = (params = {}, options = {}) => {
  const {
    query = '',
    limit = LIMIT_MAX,
  } = params;

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
  } = useQuery({
    queryKey: [namespace],
    queryFn: ({ signal }) => ky.get(FINANCE_DATA_API, { searchParams, signal }).json(),
    enabled,
    ...queryOptions,
  });

  return ({
    budgetsFunds: data?.fyFinanceData || DEFAULT_DATA,
    totalRecords: data?.totalRecords,
    isFetching,
    isLoading,
  });
};
