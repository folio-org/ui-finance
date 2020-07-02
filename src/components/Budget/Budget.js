import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import Transactions from '../../Transactions';
import CheckPermission from '../../common/CheckPermission';

import BudgetView from './BudgetView/BudgetViewContainer';
import BudgetForm from './BudgetForm/BudgetFormContainer';

const Budget = ({ match: { path } }) => (
  <Switch>
    <Route
      path={`${path}/:budgetId/view`}
      render={(props) => (
        <CheckPermission perm="ui-finance.fund-budget.view">
          <BudgetView {...props} />
        </CheckPermission>
      )}
    />
    <Route
      path={`${path}/:budgetId/edit`}
      render={(props) => (
        <CheckPermission perm="ui-finance.fund-budget.edit">
          <BudgetForm {...props} />
        </CheckPermission>
      )}
    />
    <Route
      path={`${path}/:budgetId/transactions`}
      component={Transactions}
    />
  </Switch>
);

Budget.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default Budget;
