import React from 'react';
import {
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import TransactionsList from './TransactionsList';

const Transactions = ({ match }) => {
  return (
    <Switch>
      <Route
        path={match.path}
        component={TransactionsList}
      />
    </Switch>
  );
};

Transactions.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default withRouter(Transactions);
