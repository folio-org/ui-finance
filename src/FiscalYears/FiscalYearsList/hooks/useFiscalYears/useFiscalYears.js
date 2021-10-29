import { useQuery } from 'react-query';
import { useLocation } from 'react-router';
import queryString from 'query-string';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { FISCAL_YEARS_API } from '../../../../common/const';
import { useBuildQuery } from '../useBuildQuery';

export const useFiscalYears = ({ pagination }) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'fiscal-years-list' });

  const { search } = useLocation();
  const buildQuery = useBuildQuery();
  const queryParams = queryString.parse(search);
  const query = buildQuery(queryParams);

  const searchParams = {
    query,
    limit: pagination.limit,
    offset: pagination.offset,
  };

  const queryKey = [namespace, pagination.timestamp, pagination.limit, pagination.offset];
  const queryFn = () => ky.get(FISCAL_YEARS_API, { searchParams }).json();

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
