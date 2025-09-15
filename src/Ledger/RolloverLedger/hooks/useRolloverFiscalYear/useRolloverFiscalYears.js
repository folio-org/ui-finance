import { useQuery } from 'react-query';

import { LIMIT_MAX } from '@folio/stripes-acq-components';
import { useOkapiKy } from '@folio/stripes/core';

import { FISCAL_YEARS_API } from '../../../../common/const';

export const useRolloverFiscalYears = (series) => {
  const ky = useOkapiKy();

  const searchParams = {
    limit: LIMIT_MAX,
    query: `series=="${series}" sortby periodStart`,
  };
  const { data: { fiscalYears } = {}, isLoading } = useQuery(
    ['finance', 'fiscal-years', series],
    ({ signal }) => ky.get(`${FISCAL_YEARS_API}`, { searchParams, signal }).json(),
    { enabled: Boolean(series) },
  );

  return {
    isLoading,
    fiscalYears,
  };
};
