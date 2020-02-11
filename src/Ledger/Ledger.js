import React from 'react';
import {
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';

import { LEDGERS_ROUTE } from '../common/const';
import { EditLedger } from './EditLedger';
import { CreateLedger } from './CreateLedger';
import { LedgerListContainer } from './LedgerList';

const Ledger = () => {
  return (
    <Switch>
      <Route
        path={`${LEDGERS_ROUTE}/create`}
        render={CreateLedger}
      />
      <Route
        path={`${LEDGERS_ROUTE}/:id/edit`}
        render={EditLedger}
      />

      <Route
        path={LEDGERS_ROUTE}
        render={LedgerListContainer}
      />
    </Switch>
  );
};

export default withRouter(Ledger);
