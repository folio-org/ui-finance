import React, { useCallback } from 'react';
import {
  useHistory,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';

import { LoadingPane } from '@folio/stripes/components';
import {
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  LEDGERS_ROUTE,
  GROUPS_ROUTE,
} from '../../../common/const';
import {
  useBatchAllocationLog,
  useBatchAllocationLogsMutation,
} from '../hooks';
import { BatchAllocationLogDetails } from './BatchAllocationLogDetails';

export const BatchAllocationLogDetailsContainer = () => {
  const showCallout = useShowCallout();

  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch();
  const batchAllocationLogId = match.params.id;

  const { isLoading, batchAllocationLog } = useBatchAllocationLog(batchAllocationLogId);
  const { deleteLog } = useBatchAllocationLogsMutation();

  const closeBatchAllocationLog = useCallback(() => {
    const sourcePath = location.pathname.includes(LEDGERS_ROUTE) ? LEDGERS_ROUTE : GROUPS_ROUTE;

    history.push({
      pathname: `${sourcePath}/batch-allocations/logs`,
      search: location.search,
      state: location.state,
    });
  }, [history, location]);

  const removeBatchAllocationLog = useCallback(async () => {
    const { id } = batchAllocationLog;

    try {
      await deleteLog(id);

      showCallout({
        messageId: 'ui-finance.allocation.batch.logs.actions.delete.success',
      });

      closeBatchAllocationLog();
    } catch (_) {
      showCallout({
        messageId: 'ui-finance.allocation.batch.logs.actions.delete.fail',
        type: 'error',
        values: { id },
      });
    }
  }, [batchAllocationLog, deleteLog, closeBatchAllocationLog, showCallout]);

  if (isLoading) {
    return (
      <LoadingPane
        id="pane-batch-log-details"
        onClose={closeBatchAllocationLog}
      />
    );
  }

  return (
    <BatchAllocationLogDetails
      batchAllocationLog={batchAllocationLog}
      onClose={closeBatchAllocationLog}
      onRemove={removeBatchAllocationLog}
    />
  );
};
