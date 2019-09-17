import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, Switch } from 'react-router-dom';

import {
  GROUPS_ROUTE,
  FISCAL_YEAR_ROUTE,
  TRANSACTIONS_ROUTE,
} from '../../common/const';

import Ledger from '../Ledger';
import FundsList from '../Fund';
import Budget from '../Budget/Budget';
import Groups from '../../Groups';
import Transactions from '../../Transactions';
import FiscalYear from '../FiscalYear/FiscalYear';

const Main = ({ match }) => {
  return (
    <div style={{ width: '100%' }}>
      <Switch>
        <Route
          path={`${match.path}/ledger`}
          component={Ledger}
        />
        <Route
          path={`${match.path}/fund`}
          component={FundsList}
        />
        <Route
          path={`${match.path}/budget`}
          component={Budget}
        />
        <Route
          path={GROUPS_ROUTE}
          component={Groups}
        />
        <Route
          path={FISCAL_YEAR_ROUTE}
          component={FiscalYear}
        />
        <Route
          path={`${match.path}/:budgetId/transactions`}
          component={Transactions}
        />
        <Redirect exact from={`${match.path}`} to={`${match.path}/ledger`} />
      </Switch>
    </div>
  );
};

Main.propTypes = {
  match: PropTypes.object,
};

export default Main;
