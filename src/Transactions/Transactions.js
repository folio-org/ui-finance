import React from 'react';
import {
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import TransactionsListFromBudget from './TransactionListFromBudget';
import TransactionsListFromFund from './TransactionListFromFund';

const Transactions = ({ match }) => {
  return (
    <Switch>
      <Route
        path={`${match.path}/fund/:fundId/budget/:budgetId`}
        component={TransactionsListFromFund}
      />
      <Route
        path={`${match.path}/budget/:budgetId`}
        component={TransactionsListFromBudget}
      />
    </Switch>
  );
};

Transactions.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default withRouter(Transactions);
