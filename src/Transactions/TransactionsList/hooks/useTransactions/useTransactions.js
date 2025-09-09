import { useQuery } from 'react-query';
import { useLocation } from 'react-router';
import queryString from 'query-string';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { TRANSACTIONS_API } from '../../../../common/const';
import { useBuildQuery } from '../useBuildQuery';

export const useTransactions = ({ budget, pagination }) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'transactions-list' });

  const { search } = useLocation();
  const queryParams = queryString.parse(search);
  const buildQuery = useBuildQuery();
  const query = buildQuery(queryParams, budget);

  const searchParams = {
    query,
    limit: pagination.limit,
    offset: pagination.offset,
  };

  const queryKey = [namespace, pagination.timestamp, pagination.limit, pagination.offset];
  const queryFn = ({ signal }) => ky.get(TRANSACTIONS_API, { searchParams, signal }).json();

  const options = {
    enabled: Boolean(budget?.id) && Boolean(pagination.timestamp),
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
