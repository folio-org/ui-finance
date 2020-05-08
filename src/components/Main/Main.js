import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, Switch } from 'react-router-dom';

import {
  FISCAL_YEAR_ROUTE,
  FUNDS_ROUTE,
  GROUPS_ROUTE,
  LEDGERS_ROUTE,
  TRANSACTIONS_ROUTE,
} from '../../common/const';

import { Ledger } from '../../Ledger';
import Funds from '../../Funds';
import Budget from '../Budget/Budget';
import Groups from '../../Groups';
import { FiscalYears } from '../../FiscalYears';
import Transactions from '../../Transactions';

const Main = ({ match }) => {
  return (
    <div style={{ width: '100%' }}>
      <Switch>
        <Route
          path={LEDGERS_ROUTE}
          component={Ledger}
        />
        <Route
          path={FUNDS_ROUTE}
          component={Funds}
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
          component={FiscalYears}
        />
        <Route
          path={TRANSACTIONS_ROUTE}
          component={Transactions}
        />
        <Redirect exact from={`${match.path}`} to={LEDGERS_ROUTE} />
      </Switch>
    </div>
  );
};

Main.propTypes = {
  match: PropTypes.object,
};

export default Main;
