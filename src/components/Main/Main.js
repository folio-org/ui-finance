import React from 'react';
import {
  Route,
  Redirect,
  Switch,
  useRouteMatch,
} from 'react-router-dom';

import { useStripes } from '@folio/stripes/core';
import {
  FISCAL_YEAR_ROUTE,
  FUNDS_ROUTE,
  GROUPS_ROUTE,
  LEDGERS_ROUTE,
  TRANSACTIONS_ROUTE,
} from '../../common/const';

import { FiscalYears } from '../../FiscalYears';
import Funds from '../../Funds';
import Groups from '../../Groups';
import { Ledger } from '../../Ledger';
import Transactions from '../../Transactions';
import { Budget } from '../Budget';
import { getInitialRoute } from './utils';

/* TODO: remove refs */
import POC from '../POC';
/*  */

const Main = () => {
  const match = useRouteMatch();
  const stripes = useStripes();

  return (
    <div style={{ width: '100%' }}>
      <Switch>
        <Route
          path="/finance/poc"
          component={POC}
        />
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
        <Redirect exact from={`${match.path}`} to={getInitialRoute(stripes)} />
      </Switch>
    </div>
  );
};

export default Main;
