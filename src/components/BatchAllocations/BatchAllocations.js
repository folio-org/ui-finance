import {
  Route,
  Switch,
  useRouteMatch,
} from 'react-router-dom';

import CheckPermission from '../../common/CheckPermission';

import { BatchAllocationLogDetails } from './BatchAllocationLogDetails';
import { BatchAllocationLogs } from './BatchAllocationLogs';
import { CreateBatchAllocations } from './CreateBatchAllocations';
import { UploadBatchAllocations } from './UploadBatchAllocations';

export const BatchAllocations = () => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route
        path={`${match.path}/logs/:id/view`}
        render={() => (
          <CheckPermission perm="ui-finance.fund-update-logs.view">
            <BatchAllocationLogDetails />
          </CheckPermission>
        )}
      />

      <Route
        path={`${match.path}/logs`}
        render={() => (
          <CheckPermission perm="ui-finance.fund-update-logs.view">
            <BatchAllocationLogs />
          </CheckPermission>
        )}
      />

      <Route
        path={`${match.path}/create/:id/:fiscalYearId`}
        render={() => (
          <CheckPermission perm="ui-finance.allocations.create">
            <CreateBatchAllocations />
          </CheckPermission>
        )}
      />

      <Route
        path={`${match.path}/upload/:id/:fiscalYearId`}
        render={() => (
          <CheckPermission perm="ui-finance.allocations.create">
            <UploadBatchAllocations />
          </CheckPermission>
        )}
      />
    </Switch>
  );
};
