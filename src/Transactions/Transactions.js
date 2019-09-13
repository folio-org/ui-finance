import React from 'react';
import {
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import TransactionDetails from './TransactionDetails';

const Transactions = ({ match }) => {
  return (
    <Switch>
      <Route
        path={`${match.url}/view/:id`}
        component={TransactionDetails}
      />
    </Switch>
  );
};

Transactions.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default withRouter(Transactions);
