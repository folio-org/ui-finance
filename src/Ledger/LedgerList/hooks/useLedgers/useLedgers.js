import { useQuery } from 'react-query';
import { useLocation } from 'react-router';
import queryString from 'query-string';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  getFiltersCount,
  buildArrayFieldQuery,
  makeQueryBuilder,
} from '@folio/stripes-acq-components';

import { LEDGER_FILTERS } from '../../../constants';
import { LEDGERS_API } from '../../../../common/const';
import { getKeywordQuery } from '../../LedgerListSearchConfig';

export const useLedgers = ({
  pagination,
  searchParams = {},
  options = {},
}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'ledgers-list' });

  const buildLedgersQuery = makeQueryBuilder(
    'cql.allRecords=1',
    (query, qindex) => {
      if (qindex) {
        return `(${qindex}=${query}*)`;
      }

      return `(${getKeywordQuery(query)})`;
    },
    'sortby name/sort.ascending',
    { [LEDGER_FILTERS.ACQUISITIONS_UNIT]: buildArrayFieldQuery.bind(null, [LEDGER_FILTERS.ACQUISITIONS_UNIT]) },
  );

  const { search } = useLocation();
  const queryParams = queryString.parse(search);
  const ledgersQuery = buildLedgersQuery(queryParams);
  const filtersCount = getFiltersCount(queryParams);

  const defaultSearchParams = {
    query: ledgersQuery,
    limit: pagination.limit,
    offset: pagination.offset,
  };

  const queryKey = [namespace, pagination.timestamp, pagination.limit, pagination.offset];
  const queryFn = ({ signal }) => {
    if (!filtersCount) {
      return { ledgers: [], totalRecords: 0 };
    }

    return ky
      .get(LEDGERS_API, { searchParams: { ...defaultSearchParams, ...searchParams }, signal })
      .json();
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
