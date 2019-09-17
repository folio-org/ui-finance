import React from 'react';
import {
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import TransactionsList from './TransactionsList';

const Groups = ({ match }) => {
  return (
    <Switch>
      <Route
        path={match.path}
        component={TransactionsList}
      />
    </Switch>
  );
};

Groups.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default withRouter(Groups);
