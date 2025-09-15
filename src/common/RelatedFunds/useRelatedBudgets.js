import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  BUDGETS_API,
  LIMIT_MAX,
} from '@folio/stripes-acq-components';

const DEFAULT_DATA = [];

export const useRelatedBudgets = (query, options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'related-budgets' });

  const { data, ...rest } = useQuery({
    queryKey: [namespace, tenantId, query],
    queryFn: async ({ signal }) => {
      const searchParams = {
        limit: LIMIT_MAX,
        query,
      };

      return ky.get(BUDGETS_API, { searchParams, signal }).json();
    },
    enabled: enabled && Boolean(query),
    ...queryOptions,
  });

  return ({
    budgets: data?.budgets || DEFAULT_DATA,
    totalRecords: data?.totalRecords,
    ...rest,
  });
};
