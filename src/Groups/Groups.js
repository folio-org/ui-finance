import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';

import { PermissionedRoute } from '@folio/stripes-acq-components';

import { GROUPS_ROUTE } from '../common/const';
import CheckPermission from '../common/CheckPermission';
import { GroupsListContainer } from './GroupsList';
import { CreateGroup } from './CreateGroup';
import { EditGroup } from './EditGroup';
import { CreateBatchAllocations } from '../common/components/BatchAllocations';

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
        path={GROUPS_ROUTE}
        render={() => (
          <CheckPermission perm="ui-finance.group.view">
            <GroupsListContainer />
          </CheckPermission>
        )}
      />
      <PermissionedRoute
        path={`${GROUPS_ROUTE}/:id/batch-allocations/fiscalyear/:fiscalyear`}
        perm="ui-finance.group.view" // this needs to be changed
        returnLink={GROUPS_ROUTE}
        returnLinkLabelId="ui-finance.ledger"
      >
        <CreateBatchAllocations />
      </PermissionedRoute>
    </Switch>
  );
};

export default Groups;
