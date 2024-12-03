import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { LIMIT_MAX } from '@folio/stripes-acq-components';

import { FISCAL_YEARS_API } from '../../const';
import { useLedgerCurrentFiscalYear } from '../useLedgerCurrentFiscalYear';

const DEFAULT_DATA = [];

export const useLedgerUpcomingFiscalYears = (ledgerId, options = {}) => {
  const {
    enabled = true,
    ...queryOptions
  } = options;

  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'ledger-upcoming-fiscal-years' });

  const {
    currentFiscalYear,
    isFetching: isCurrentFYFetching,
    isLoading: isCurrentFYLoading,
  } = useLedgerCurrentFiscalYear(ledgerId);

  const searchParams = {
    query: `series==${currentFiscalYear?.series} and periodStart >= ${currentFiscalYear?.periodStart} sortby periodStart/sort.descending series/sort.ascending`,
    limit: LIMIT_MAX,
  };

  const {
    data,
    isFetching: isFiscalYearsFetching,
    isLoading: isFiscalYearsLoading,
  } = useQuery({
    queryKey: [namespace, currentFiscalYear],
    queryFn: ({ signal }) => ky.get(FISCAL_YEARS_API, { signal, searchParams }).json(),
    enabled: Boolean(enabled && currentFiscalYear?.series && currentFiscalYear?.periodStart),
    ...queryOptions,
  });

  return {
    fiscalYears: data?.fiscalYears || DEFAULT_DATA,
    totalRecords: data?.totalRecords,
    isFetching: isCurrentFYFetching || isFiscalYearsFetching,
    isLoading: isCurrentFYLoading || isFiscalYearsLoading,
  };
};
