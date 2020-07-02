import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';

import { IfPermission } from '@folio/stripes/core';

import { FUNDS_ROUTE } from '../common/const';
import NoPermissionsMessage from '../common/NoPermissionsMessage';

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
            {({ hasPermission }) => (hasPermission
              ? <CreateFund />
              : <NoPermissionsMessage />
            )}
          </IfPermission>
        )}
      />
      <Route
        path={`${FUNDS_ROUTE}/edit/:id`}
        render={() => (
          <IfPermission perm="ui-finance.fund-budget.edit">
            {({ hasPermission }) => (hasPermission
              ? <EditFund />
              : <NoPermissionsMessage />
            )}
          </IfPermission>
        )}
      />
      <Route
        path={FUNDS_ROUTE}
        render={() => (
          <IfPermission perm="ui-finance.fund-budget.view">
            {({ hasPermission }) => (hasPermission
              ? <FundsListContainer />
              : <NoPermissionsMessage />
            )}
          </IfPermission>
        )}
      />
    </Switch>
  );
};

export default Funds;
