import { useQuery } from 'react-query';

import { useOkapiKy, useNamespace } from '@folio/stripes/core';
import { LIMIT_MAX } from '@folio/stripes-acq-components';

import { FISCAL_YEARS_API } from '../../common/const';

export const useFiscalYearOptions = (options = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace();

  const queryKey = [namespace, 'fiscalYearOptions'];
  const queryFn = () => ky
    .get(FISCAL_YEARS_API, {
      searchParams: {
        limit: LIMIT_MAX,
        query: 'cql.allRecords=1 sortby name/sort.ascending',
      },
    })
    .json();

  const { data = {}, isFetching: isLoading } = useQuery({ queryKey, queryFn, ...options });

  let fiscalYearOptions = [];

  if (!isLoading) {
    fiscalYearOptions = data.fiscalYears?.map(({ code }) => ({ label: code, value: code })) || [];
  }

  return { isLoading, fiscalYearOptions };
};
