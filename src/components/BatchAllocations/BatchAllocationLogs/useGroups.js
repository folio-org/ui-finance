import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  ALL_RECORDS_CQL,
  LIMIT_MAX,
} from '@folio/stripes-acq-components';

import { GROUPS_API } from '../../../common/const';

const DEFAULT_DATA = [];

export const useGroups = (params = {}, options = {}) => {
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
  const [namespace] = useNamespace({ key: 'groups' });

  const {
    data,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [namespace, query, offset, limit, tenantId],
    queryFn: ({ signal }) => ky.get(GROUPS_API, { searchParams, signal }).json(),
    enabled,
    ...queryOptions,
  });

  return {
    groups: data?.groups || DEFAULT_DATA,
    totalRecords: data?.totalRecords || 0,
    isFetching,
    isLoading,
  };
};
