import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import { IfPermission } from '@folio/stripes/core';

import Transactions from '../../Transactions';

import BudgetView from './BudgetView/BudgetViewContainer';
import BudgetForm from './BudgetForm/BudgetFormContainer';

const Budget = ({ match: { path } }) => (
  <Switch>
    <Route
      path={`${path}/:budgetId/view`}
      render={(props) => (
        <IfPermission perm="ui-finance.fund-budget.view">
          <BudgetView {...props} />
        </IfPermission>
      )}
    />
    <Route
      path={`${path}/:budgetId/edit`}
      render={(props) => (
        <IfPermission perm="ui-finance.fund-budget.edit">
          <BudgetForm {...props} />
        </IfPermission>
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
