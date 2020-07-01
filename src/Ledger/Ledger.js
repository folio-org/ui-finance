import React from 'react';
import {
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';

import { IfPermission } from '@folio/stripes/core';

import { LEDGERS_ROUTE } from '../common/const';
import { EditLedger } from './EditLedger';
import { CreateLedger } from './CreateLedger';
import { CreateLedgerFiscalYear } from './CreateLedgerFiscalYear';
import { LedgerListContainer } from './LedgerList';

const Ledger = () => {
  return (
    <Switch>
      <Route
        path={`${LEDGERS_ROUTE}/create`}
        render={() => (
          <IfPermission perm="ui-finance.ledger.create">
            <CreateLedger />
          </IfPermission>
        )}
      />
      <Route
        path={`${LEDGERS_ROUTE}/fiscalyear/create`}
        render={() => (
          <IfPermission perm="ui-finance.fiscal-year.create">
            <CreateLedgerFiscalYear />
          </IfPermission>
        )}
      />
      <Route
        path={`${LEDGERS_ROUTE}/:id/fiscalyear/create`}
        render={() => (
          <IfPermission perm="ui-finance.fiscal-year.create">
            <CreateLedgerFiscalYear />
          </IfPermission>
        )}
      />
      <Route
        path={`${LEDGERS_ROUTE}/:id/edit`}
        render={() => (
          <IfPermission perm="ui-finance.ledger.edit">
            <EditLedger />
          </IfPermission>
        )}
      />
      <Route
        path={LEDGERS_ROUTE}
        render={() => (
          <IfPermission perm="ui-finance.ledger.view">
            <LedgerListContainer />
          </IfPermission>
        )}
      />
    </Switch>
  );
};

export default withRouter(Ledger);
