import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  CQLBuilder,
  LIMIT_MAX,
} from '@folio/stripes-acq-components';

import { FISCAL_YEARS_API } from '../../const';
import { useFiscalYear } from '../useFiscalYear';
import { useLedgerCurrentFiscalYear } from '../useLedgerCurrentFiscalYear';

const DEFAULT_DATA = [];

export const useLedgerPreviousFiscalYears = (ledger, options = {}) => {
  const { fiscalYearOneId, ledgerId } = ledger;
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const [namespace] = useNamespace({ key: 'ledger-previous-fiscal-years' });
  const ky = useOkapiKy({ tenant: tenantId });

  const {
    fiscalYear: fiscalYearOne,
    isFetching: isFiscalYearOneFetching,
    isLoading: isFiscalYearOneLoading,
  } = useFiscalYear(fiscalYearOneId);

  const {
    currentFiscalYear,
    isFetching: isCurrentFiscalYearFetching,
    isLoading: isCurrentFiscalYearLoading,
  } = useLedgerCurrentFiscalYear(ledgerId);

  const {
    data,
    isFetching: isPreviousFiscalYearsFetching,
    isLoading: isPreviousFiscalYearsLoading,
    refetch,
  } = useQuery({
    queryKey: [namespace, ledgerId, tenantId, fiscalYearOne?.id, currentFiscalYear?.id],
    queryFn: ({ signal }) => {
      const cqlBuilder = new CQLBuilder();
      const searchParams = {
        limit: LIMIT_MAX,
        query: (
          cqlBuilder
            .equal('series', currentFiscalYear.series)
            .gte('periodStart', fiscalYearOne.periodStart)
            .lessThan('periodStart', currentFiscalYear.periodStart)
            .sortByMultiple([
              { field: 'periodStart', order: 'desc' },
              { field: 'series', order: 'asc' },
            ])
            .build()
        ),
      };

      return ky.get(FISCAL_YEARS_API, { signal, searchParams }).json();
    },
    enabled: enabled && Boolean(
      ledgerId
      && fiscalYearOne?.id
      && currentFiscalYear?.id,
    ),
    ...queryOptions,
  });

  const isFetching = (
    isFiscalYearOneFetching
    || isCurrentFiscalYearFetching
    || isPreviousFiscalYearsFetching
  );

  const isLoading = (
    isFiscalYearOneLoading
    || isCurrentFiscalYearLoading
    || isPreviousFiscalYearsLoading
  );

  return {
    fiscalYears: data?.fiscalYears || DEFAULT_DATA,
    isFetching,
    isLoading,
    refetch,
  };
};
