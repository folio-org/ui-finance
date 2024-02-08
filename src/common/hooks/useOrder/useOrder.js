import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { ORDERS_API } from '@folio/stripes-acq-components';

export const useOrder = (orderId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'purchase-order' });

  const {
    data,
    isLoading,
  } = useQuery({
    queryKey: [namespace, orderId],
    queryFn: async () => ky.get(`${ORDERS_API}/${orderId}`).json(),
    enabled: Boolean(orderId),
  });

  return ({
    order: data,
    isLoading,
  });
};
