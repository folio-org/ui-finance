import { useQuery } from 'react-query';
import { useLocation } from 'react-router';
import queryString from 'query-string';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { getFiltersCount } from '@folio/stripes-acq-components';

import { GROUPS_API } from '../../../../common/const';
import { useBuildQuery } from '../useBuildQuery';

export const useGroups = ({ pagination }) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'groups-list' });

  const { search } = useLocation();
  const buildQuery = useBuildQuery();
  const queryParams = queryString.parse(search);
  const query = buildQuery(queryParams);
  const filtersCount = getFiltersCount(queryParams);

  const searchParams = {
    query,
    limit: pagination.limit,
    offset: pagination.offset,
  };

  const queryKey = [namespace, pagination.timestamp, pagination.limit, pagination.offset];
  const queryFn = () => {
    if (!filtersCount) {
      return { groups: [], totalRecords: 0 };
    }

    return (
      ky.get(GROUPS_API, { searchParams }).json()
    );
  };
  const options = {
    enabled: Boolean(pagination.timestamp),
    keepPreviousData: true,
  };

  const { isFetching, data } = useQuery(
    queryKey,
    queryFn,
    options,
  );

  return ({
    ...data,
    isFetching,
  });
};
