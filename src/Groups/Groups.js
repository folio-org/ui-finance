import {
  Route,
  Switch,
} from 'react-router-dom';

import { GROUPS_ROUTE } from '../common/const';
import CheckPermission from '../common/CheckPermission';
import { BatchAllocations } from '../components';
import { GroupsListContainer } from './GroupsList';
import { CreateGroup } from './CreateGroup';
import { EditGroup } from './EditGroup';

const Groups = () => {
  return (
    <Switch>
      <Route
        path={`${GROUPS_ROUTE}/create`}
        render={() => (
          <CheckPermission perm="ui-finance.group.create">
            <CreateGroup />
          </CheckPermission>
        )}
      />
      <Route
        path={`${GROUPS_ROUTE}/:id/edit`}
        render={() => (
          <CheckPermission perm="ui-finance.group.edit">
            <EditGroup />
          </CheckPermission>
        )}
      />
      <Route
        path={`${GROUPS_ROUTE}/:id/batch-allocations`}
        render={() => (
          <CheckPermission perm="ui-finance.allocations.create">
            <BatchAllocations />
          </CheckPermission>
        )}
      />
      <Route
        path={GROUPS_ROUTE}
        render={() => (
          <CheckPermission perm="ui-finance.group.view">
            <GroupsListContainer />
          </CheckPermission>
        )}
      />
      <Route
        path={`${GROUPS_ROUTE}/:id/batch-allocations`}
        render={() => (
          <CheckPermission perm="ui-finance.allocations.create">
            <BatchAllocations />
          </CheckPermission>
        )}
      />
    </Switch>
  );
};

export default Groups;
