import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';

import { IfPermission } from '@folio/stripes/core';

import { FUNDS_ROUTE } from '../common/const';

import { FundsListContainer } from './FundsList';
import { CreateFund } from './CreateFund';
import { EditFund } from './EditFund';

const Funds = () => {
  return (
    <Switch>
      <Route
        path={`${FUNDS_ROUTE}/create`}
        render={() => (
          <IfPermission perm="ui-finance.fund-budget.create">
            <CreateFund />
          </IfPermission>
        )}
      />
      <Route
        path={`${FUNDS_ROUTE}/edit/:id`}
        render={() => (
          <IfPermission perm="ui-finance.fund-budget.edit">
            <EditFund />
          </IfPermission>
        )}
      />
      <Route
        path={FUNDS_ROUTE}
        render={() => (
          <IfPermission perm="ui-finance.fund-budget.view">
            <FundsListContainer />
          </IfPermission>
        )}
      />
    </Switch>
  );
};

export default Funds;
