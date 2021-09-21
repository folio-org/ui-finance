import { useQuery } from 'react-query';
import { useLocation } from 'react-router';
import queryString from 'query-string';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  FUNDS_API,
  getFiltersCount,
  makeQueryBuilder,
  buildArrayFieldQuery,
} from '@folio/stripes-acq-components';

import { FUND_FILTERS } from '../../../constants';
import { getKeywordQuery } from '../../FundsListSearchConfig';

export const useFunds = ({
  pagination,
  fetchReferences,
  searchParams = {},
  options = {},
}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'funds-list' });

  const buildFundsQuery = makeQueryBuilder(
    'cql.allRecords=1',
    (query, qindex) => {
      if (qindex) {
        return `(${qindex}=${query}*)`;
      }

      return `(${getKeywordQuery(query)})`;
    },
    'sortby name/sort.ascending',
    {
      [FUND_FILTERS.ACQUISITIONS_UNIT]: buildArrayFieldQuery.bind(null, [FUND_FILTERS.ACQUISITIONS_UNIT]),
      [FUND_FILTERS.TAGS]: buildArrayFieldQuery.bind(null, [FUND_FILTERS.TAGS]),
    },
  );

  const { search } = useLocation();
  const queryParams = queryString.parse(search);
  const query = buildFundsQuery(queryParams);
  const filtersCount = getFiltersCount(queryParams);

  const defaultSearchParams = {
    query,
    limit: pagination.limit,
    offset: pagination.offset,
  };

  const queryKey = [namespace, pagination.timestamp, pagination.limit, pagination.offset];
  const queryFn = async () => {
    if (!filtersCount) {
      return { funds: [], totalRecords: 0 };
    }

    const { funds, totalRecords } = await ky
      .get(FUNDS_API, { searchParams: { ...defaultSearchParams, ...searchParams } })
      .json();

    const { ledgersMap } = await fetchReferences(funds);
    const fundsResult = funds.map(fund => ({
      ...fund,
      ledger: ledgersMap[fund.ledgerId]?.name,
    }));

    return {
      funds: fundsResult,
      totalRecords,
    };
  };
  const defaultOptions = {
    enabled: Boolean(pagination.timestamp),
    keepPreviousData: true,
  };

  const { isFetching, data } = useQuery(
    queryKey,
    queryFn,
    {
      ...defaultOptions,
      ...options,
    },
  );

  return ({
    ...data,
    isFetching,
  });
};
