import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';

import { GROUPS_ROUTE } from '../common/const';

import { GroupsListContainer } from './GroupsList';
import { CreateGroup } from './CreateGroup';
import { EditGroup } from './EditGroup';

const Groups = () => {
  return (
    <Switch>
      <Route
        path={`${GROUPS_ROUTE}/create`}
        component={CreateGroup}
      />
      <Route
        path={`${GROUPS_ROUTE}/:id/edit`}
        component={EditGroup}
      />
      <Route
        path={GROUPS_ROUTE}
        component={GroupsListContainer}
      />
    </Switch>
  );
};

export default Groups;
