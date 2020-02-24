import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';

import { FUNDS_ROUTE } from '../common/const';

import { FundsListContainer } from './FundsList';
import { CreateFund } from './CreateFund';
import { EditFund } from './EditFund';

const Funds = () => {
  return (
    <Switch>
      <Route
        path={`${FUNDS_ROUTE}/create`}
        component={CreateFund}
      />
      <Route
        path={`${FUNDS_ROUTE}/edit/:id`}
        component={EditFund}
      />
      <Route
        path={FUNDS_ROUTE}
        component={FundsListContainer}
      />
    </Switch>
  );
};

export default Funds;
