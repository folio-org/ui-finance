import queryString from 'query-string';
import { useQuery } from 'react-query';

import { LIMIT_MAX } from '@folio/stripes-acq-components';
import { useOkapiKy } from '@folio/stripes/core';

import { FISCAL_YEARS_API } from '../../common/const';

export const useRolloverFiscalYears = (series) => {
  const ky = useOkapiKy();

  const params = {
    limit: LIMIT_MAX,
    query: `series=="${series}" sortby periodStart`,
  };
  const { data: { fiscalYears } = {}, isLoading } = useQuery(
    ['finance', 'fiscal-years', series],
    () => ky(`${FISCAL_YEARS_API}?${queryString.stringify(params)}`).json(),
    { enabled: Boolean(series) },
  );

  return {
    isLoading,
    fiscalYears,
  };
};
