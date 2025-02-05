import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

import { FISCAL_YEARS_API } from '../../const';

export const useFiscalYear = (fiscalYearId, options = {}) => {
  const {
    enabled = true,
    ...queryOptions
  } = options;

  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'fiscal-year' });

  const {
    data,
    ...rest
  } = useQuery({
    queryKey: [namespace, fiscalYearId],
    queryFn: ({ signal }) => ky.get(`${FISCAL_YEARS_API}/${fiscalYearId}`, { signal }).json(),
    enabled: enabled && Boolean(fiscalYearId),
    ...queryOptions,
  });

  return ({
    fiscalYear: data,
    ...rest,
  });
};
