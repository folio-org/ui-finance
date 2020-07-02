import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';

import { FUNDS_ROUTE } from '../common/const';
import CheckPermission from '../common/CheckPermission';

import { FundsListContainer } from './FundsList';
import { CreateFund } from './CreateFund';
import { EditFund } from './EditFund';

const Funds = () => {
  return (
    <Switch>
      <Route
        path={`${FUNDS_ROUTE}/create`}
        render={() => (
          <CheckPermission perm="ui-finance.fund-budget.create">
            <CreateFund />
          </CheckPermission>
        )}
      />
      <Route
        path={`${FUNDS_ROUTE}/edit/:id`}
        render={() => (
          <CheckPermission perm="ui-finance.fund-budget.edit">
            <EditFund />
          </CheckPermission>
        )}
      />
      <Route
        path={FUNDS_ROUTE}
        render={() => (
          <CheckPermission perm="ui-finance.fund-budget.view">
            <FundsListContainer />
          </CheckPermission>
        )}
      />
    </Switch>
  );
};

export default Funds;
