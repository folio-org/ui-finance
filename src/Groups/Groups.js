import React from 'react';
import {
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import GroupsList from './GroupsList';
import EditGroup from './EditGroup';

const Groups = ({ match }) => {
  return (
    <Switch>
      <Route
        path={`${match.url}/edit/:id`}
        component={EditGroup}
      />
      <Route
        path={match.url}
        component={GroupsList}
      />
    </Switch>
  );
};

Groups.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default withRouter(Groups);
