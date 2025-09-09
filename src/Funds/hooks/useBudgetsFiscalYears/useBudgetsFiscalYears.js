import { useQuery } from 'react-query';

import { LIMIT_MAX } from '@folio/stripes-acq-components';
import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { FISCAL_YEARS_API } from '../../../common/const';

export const useBudgetsFiscalYears = ({
  series,
  periodStart,
} = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'budget-fiscal-years' });

  const searchParams = {
    query: `(periodStart>=${periodStart} and series==${series}) sortby periodStart`,
    limit: LIMIT_MAX,
    offset: 0,
  };

  const queryKey = [namespace, series, periodStart];
  const queryFn = ({ signal }) => ky.get(FISCAL_YEARS_API, { searchParams, signal }).json();
  const options = {
    enabled: Boolean(series && periodStart),
  };

  const { isLoading, data } = useQuery(
    queryKey,
    queryFn,
    options,
  );

  return {
    fiscalYears: data?.fiscalYears || [],
    isLoading,
  };
};
