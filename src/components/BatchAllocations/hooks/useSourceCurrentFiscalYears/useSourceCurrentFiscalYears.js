import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { fetchSourceCurrentFiscalYears } from '../../utils';

export const useSourceCurrentFiscalYears = (
  sourceType,
  sourceId,
  options = {},
) => {
  const {
    enabled = true,
    ...queryOptions
  } = options;

  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'source-current-fiscal-years' });

  const {
    data,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [namespace, sourceType, sourceId],
    queryFn: async ({ signal }) => {
      return fetchSourceCurrentFiscalYears(ky)(sourceType, sourceId, { signal });
    },
    enabled: Boolean(enabled && sourceType && sourceId),
    ...queryOptions,
  });

  return ({
    currentFiscalYears: data,
    isFetching,
    isLoading,
  });
};
