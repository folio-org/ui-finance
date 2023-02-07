import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { batchRequest } from '@folio/stripes-acq-components';

import { FISCAL_YEARS_API } from '../../const';

export const useFiscalYearsBatch = (fiscalYearIds) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'fiscal-years-batch' });

  const {
    data,
    isLoading,
  } = useQuery(
    [namespace, fiscalYearIds],
    async ({ signal }) => {
      const response = await batchRequest(
        ({ params: searchParams }) => ky.get(FISCAL_YEARS_API, { searchParams, signal }).json(),
        fiscalYearIds,
      );

      return response.flatMap(({ fiscalYears }) => fiscalYears);
    },
    { enabled: Boolean(fiscalYearIds?.length) },
  );

  return {
    fiscalYears: data || [],
    isLoading,
  };
};
