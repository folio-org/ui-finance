import React, { useCallback } from 'react';
import {
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import TransactionsList from './TransactionsList';
import {
  BUDGET_ROUTE,
  BUDGET_VIEW_ROUTE,
  FUNDS_ROUTE,
} from '../common/const';

const Transactions = ({ match, history }) => {
  const closePane = useCallback(
    () => {
      return match.params.id
        ? history.push(`${FUNDS_ROUTE}/view/${match.params.id}`)
        : history.push(`${BUDGET_ROUTE}${match.params.budgetId}${BUDGET_VIEW_ROUTE}`);
    },
    [history, match.params],
  );

  return (
    <Switch>
      <Route
        path={match.path}
        render={() => <TransactionsList closePane={closePane} />}
      />
    </Switch>
  );
};

Transactions.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
};

export default withRouter(Transactions);
