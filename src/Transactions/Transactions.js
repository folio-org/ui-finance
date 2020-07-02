import React, { useCallback } from 'react';
import {
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import { IfPermission } from '@folio/stripes/core';

import {
  BUDGET_ROUTE,
  FUNDS_ROUTE,
} from '../common/const';
import NoPermissionsMessage from '../common/NoPermissionsMessage';
import TransactionsList from './TransactionsList';

const Transactions = ({ match, history }) => {
  const goToBudgetView = useCallback(
    (params) => {
      history.push(`${BUDGET_ROUTE}${params.budgetId}/view`);
    },
    [history],
  );

  const goToFundDetails = useCallback(
    (params) => {
      history.push(`${FUNDS_ROUTE}/view/${params.fundId}`);
    },
    [history],
  );

  return (
    <Switch>
      <Route
        path={`${match.path}/fund/:fundId/budget/:budgetId`}
        render={({ match: { params } }) => (
          <IfPermission perm="ui-finance.fund-budget.view">
            {({ hasPermission }) => (hasPermission
              ? (
                <TransactionsList
                  closePane={() => goToFundDetails(params)}
                />
              )
              : <NoPermissionsMessage />
            )}
          </IfPermission>
        )}
      />
      <Route
        path={`${match.path}/budget/:budgetId`}
        render={({ match: { params } }) => (
          <IfPermission perm="ui-finance.fund-budget.view">
            {({ hasPermission }) => (hasPermission
              ? (
                <TransactionsList
                  closePane={() => goToBudgetView(params)}
                />
              )
              : <NoPermissionsMessage />
            )}
          </IfPermission>
        )}
      />
    </Switch>
  );
};

Transactions.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
};

export default withRouter(Transactions);
