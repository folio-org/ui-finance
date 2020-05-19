import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import Transactions from '../../Transactions';

import BudgetView from './BudgetView/BudgetViewContainer';
import BudgetForm from './BudgetForm/BudgetFormContainer';

const Budget = ({ match: { path } }) => (
  <Switch>
    <Route
      path={`${path}/:budgetId/view`}
      component={BudgetView}
    />
    <Route
      path={`${path}/:budgetId/edit`}
      render={
        ({ history, match, location }) => (
          <BudgetForm
            history={history}
            match={match}
            location={location}
          />
        )
      }
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
