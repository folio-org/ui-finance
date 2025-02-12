import { useCallback } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';

import { useUsersBatch } from '@folio/stripes-acq-components';

import {
  LEDGERS_ROUTE,
  BATCH_ALLOCATIONS_SOURCE,
} from '../../../common/const';
import { resolveDefaultBackPathname } from '../utils';
import { useBatchAllocationLogs } from '../hooks';
import { BatchAllocationLogsList } from './BatchAllocationLogsList';
import { useBatchAllocationLogsMutation } from './useBatchAllocationLogsMutation';

export const BatchAllocationLogs = ({
  history,
  location,
  match,
}) => {
  const { id: sourceId } = match.params;
  const sourceType = location.pathname.includes(LEDGERS_ROUTE) ?
    BATCH_ALLOCATIONS_SOURCE.ledger :
    BATCH_ALLOCATIONS_SOURCE.group;
  const backPathname = location.state?.backPathname || resolveDefaultBackPathname(sourceType, sourceId);

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
    history.push(backPathname);
  }, [history, backPathname]);

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

BatchAllocationLogs.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};
