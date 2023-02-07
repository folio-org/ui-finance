import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { batchRequest } from '@folio/stripes-acq-components';

import { FUND_TYPES_API } from '../../const';

export const useFundTypesBatch = (fundTypeIds) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'fund-types-batch' });

  const {
    data,
    isLoading,
  } = useQuery(
    [namespace, fundTypeIds],
    async ({ signal }) => {
      const response = await batchRequest(
        ({ params: searchParams }) => ky.get(FUND_TYPES_API, { searchParams, signal }).json(),
        fundTypeIds,
      );

      return response.flatMap(({ fundTypes }) => fundTypes);
    },
    { enabled: Boolean(fundTypeIds?.length) },
  );

  return {
    fundTypes: data || [],
    isLoading,
  };
};
