import { useQuery } from 'react-query';

import { useOkapiKy, useNamespace } from '@folio/stripes/core';

import { FUNDS_API } from '@folio/stripes-acq-components';

export const useFund = (fundId) => {
  const ky = useOkapiKy();
  const namespace = useNamespace({ key: 'group-funds' });

  const { isLoading, refetch } = useQuery(
    [namespace, fundId],
    () => ky.get(`${FUNDS_API}/${fundId}`).json(),
    { enabled: false },
  );

  return ({
    isLoading,
    fetchFund: refetch,
  });
};
