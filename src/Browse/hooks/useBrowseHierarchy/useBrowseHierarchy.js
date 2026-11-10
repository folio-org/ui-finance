import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { FISCAL_YEAR_HIERARCHY_API } from '../../../common/const';
import { buildHierarchy } from '../../utils';

const EMPTY_HIERARCHY = [];
const EMPTY_COUNTS = {
  ledgers: 0,
  groups: 0,
  funds: 0,
  budgets: 0,
  expenseClasses: 0,
};
const EMPTY_KEYS = {};

export const useBrowseHierarchy = (fiscalYearId, options = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'browse-hierarchy' });

  const { data, isLoading } = useQuery({
    queryKey: [namespace, fiscalYearId],
    queryFn: async ({ signal }) => {
      const response = await ky.get(FISCAL_YEAR_HIERARCHY_API, {
        searchParams: { fiscalYearId },
        signal,
      }).json();

      return buildHierarchy(response);
    },
    enabled: Boolean(fiscalYearId),
    ...options,
  });

  return {
    hierarchy: data?.hierarchy || EMPTY_HIERARCHY,
    counts: data?.counts || EMPTY_COUNTS,
    keysByType: data?.keysByType || EMPTY_KEYS,
    isLoading,
  };
};
