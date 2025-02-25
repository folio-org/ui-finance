import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { FUND_UPDATE_LOGS_API } from '../../../../common/const';
import { dehydrateAllocationLog } from '../../utils';

export const useBatchAllocationLog = (id) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'fund-update-logs' });

  const {
    data,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [namespace, id],
    queryFn: async ({ signal }) => dehydrateAllocationLog(await ky.get(`${FUND_UPDATE_LOGS_API}/${id}`, { signal }).json()),
    enabled: Boolean(id),
  });

  return ({
    batchAllocationLog: data,
    isFetching,
    isLoading,
  });
};
