import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { getBudgetByFundAndFY } from '../../utils';

export const useBudgetByFundAndFY = (fundId, fiscalYearId, options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'budget-for-fund-in-specific-fy' });

  const {
    data,
    isFetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [namespace, fundId, fiscalYearId, tenantId],
    queryFn: ({ signal }) => getBudgetByFundAndFY(ky, signal)(fundId, fiscalYearId),
    enabled: Boolean(enabled && fundId && fiscalYearId),
    ...queryOptions,
  });

  return {
    budget: data?.budgets?.[0],
    isFetching,
    isLoading,
    refetch,
  };
};
