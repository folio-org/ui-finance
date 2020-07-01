import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';

import { IfPermission } from '@folio/stripes/core';

import { GROUPS_ROUTE } from '../common/const';

import { GroupsListContainer } from './GroupsList';
import { CreateGroup } from './CreateGroup';
import { EditGroup } from './EditGroup';

const Groups = () => {
  return (
    <Switch>
      <Route
        path={`${GROUPS_ROUTE}/create`}
        render={() => (
          <IfPermission perm="ui-finance.group.create">
            <CreateGroup />
          </IfPermission>
        )}
      />
      <Route
        path={`${GROUPS_ROUTE}/:id/edit`}
        render={() => (
          <IfPermission perm="ui-finance.group.edit">
            <EditGroup />
          </IfPermission>
        )}
      />
      <Route
        path={GROUPS_ROUTE}
        render={() => (
          <IfPermission perm="ui-finance.group.view">
            <GroupsListContainer />
          </IfPermission>
        )}
      />
    </Switch>
  );
};

export default Groups;
