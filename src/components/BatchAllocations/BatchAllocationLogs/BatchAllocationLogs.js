import { useCallback } from 'react';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';

import { useUsersBatch } from '@folio/stripes-acq-components';

import {
  LEDGERS_ROUTE,
  GROUPS_ROUTE,
} from '../../../common/const';
import {
  useBatchAllocationLogs,
  useBatchAllocationLogsMutation,
} from '../hooks';
import { BatchAllocationLogsList } from './BatchAllocationLogsList';

export const BatchAllocationLogs = () => {
  const location = useLocation();
  const history = useHistory();

  const {
    data: logs,
    isLoading: isLogsLoading,
    totalRecords: logsCount,
    refetch,
  } = useBatchAllocationLogs();

  const userIdsSet = logs.map(({ metadata: { createdByUserId } }) => createdByUserId);

  const {
    users,
    isLoading: isUsersLoading,
  } = useUsersBatch(userIdsSet);

  const logsWithUsers = logs?.map((log) => ({
    ...log,
    createdByUser: users.find((user) => user.id === log.metadata.createdByUserId) || null,
  })) || [];

  const { deleteLog } = useBatchAllocationLogsMutation();

  const onClose = useCallback(() => {
    history.push({
      pathname: location.pathname.includes(LEDGERS_ROUTE) ? LEDGERS_ROUTE : GROUPS_ROUTE,
      search: location.search,
    });
  }, [history, location]);

  return (
    <BatchAllocationLogsList
      dataReset={refetch}
      deleteLog={deleteLog}
      isLoading={isLogsLoading || isUsersLoading}
      logs={logsWithUsers}
      onClose={onClose}
      totalRecords={logsCount}
    />
  );
};
