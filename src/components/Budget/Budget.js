import React from 'react';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import ReactRouterPropTypes from 'react-router-prop-types';

import BudgetView from './BudgetView/BudgetViewContainer';

const Budget = ({ match: { path } }) => (
  <Switch>
    <Route
      path={`${path}:budgetId/view`}
      render={
        props => (
          <BudgetView
            {...props}
          />
        )
      }
    />
  </Switch>
);

Budget.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default Budget;
