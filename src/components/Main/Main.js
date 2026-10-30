import React from 'react';
import {
  Route,
  Redirect,
  Switch,
  useRouteMatch,
} from 'react-router-dom';

import { useStripes } from '@folio/stripes/core';
import {
  BROWSE_ROUTE,
  FISCAL_YEAR_ROUTE,
  FUNDS_ROUTE,
  GROUPS_ROUTE,
  LEDGERS_ROUTE,
  TRANSACTIONS_ROUTE,
} from '../../common/const';

import { Browse } from '../../Browse';
import { useNavigationSettings } from '../../common/hooks';
import { FiscalYears } from '../../FiscalYears';
import Funds from '../../Funds';
import Groups from '../../Groups';
import { Ledger } from '../../Ledger';
import Transactions from '../../Transactions';
import { Budget } from '../Budget';
import { getInitialRoute } from './utils';

const Main = () => {
  const match = useRouteMatch();
  const stripes = useStripes();
  const { navigationSettings, isLoading } = useNavigationSettings();

  const isBrowseTabEnabled = Boolean(navigationSettings?.enabled);

  return (
    <div style={{ width: '100%' }}>
      <Switch>
        {isBrowseTabEnabled && (
          <Route
            path={BROWSE_ROUTE}
            component={Browse}
          />
        )}
        {/* defensive fallback: the Browse route is not registered while the tab is disabled */}
        {!isLoading && !isBrowseTabEnabled && (
          <Redirect from={BROWSE_ROUTE} to={getInitialRoute(stripes)} />
        )}
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
