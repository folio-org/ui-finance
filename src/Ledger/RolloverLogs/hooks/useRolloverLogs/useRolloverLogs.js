import queryString from 'query-string';
import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  buildDateRangeQuery,
  makeQueryBuilder,
} from '@folio/stripes-acq-components';

import { LEDGER_ROLLOVER_LOGS_API } from '../../../../common/const';

export const useRolloverLogs = ({
  ledgerId,
  pagination,
}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'ledger-rollover-logs' });
  const { search } = useLocation();

  const queryParams = queryString.parse(search);
  const query = makeQueryBuilder(
    `ledgerId=="${ledgerId}"`,
    null,
    'sortby startDate/sort.descending',
    {
      startDate: buildDateRangeQuery.bind(null, ['startDate']),
      endDate: buildDateRangeQuery.bind(null, ['endDate']),
    },
  )({
    ledgerId,
    ...queryParams,
  });

  const searchParams = {
    query,
    limit: pagination.limit,
    offset: pagination.offset,
  };

  const queryKey = [namespace, ledgerId, pagination.timestamp, pagination.limit, pagination.offset];
  const queryFn = ({ signal }) => ky.get(LEDGER_ROLLOVER_LOGS_API, { searchParams, signal }).json();
  const options = {
    enabled: Boolean(ledgerId && pagination.timestamp),
    keepPreviousData: true,
  };

  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useQuery(queryKey, queryFn, options);

  return {
    isFetching,
    isLoading,
    rolloverLogs: data?.ledgerFiscalYearRolloverLogs || [],
    refetch,
    totalRecords: data?.totalRecords,
  };
};
