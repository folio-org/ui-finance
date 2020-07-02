import React from 'react';
import {
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';

import { IfPermission } from '@folio/stripes/core';

import NoPermissionsMessage from '../common/NoPermissionsMessage';
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
            {({ hasPermission }) => (hasPermission
              ? <CreateLedger />
              : <NoPermissionsMessage />
            )}
          </IfPermission>
        )}
      />
      <Route
        path={`${LEDGERS_ROUTE}/fiscalyear/create`}
        render={() => (
          <IfPermission perm="ui-finance.fiscal-year.create">
            {({ hasPermission }) => (hasPermission
              ? <CreateLedgerFiscalYear />
              : <NoPermissionsMessage />
            )}
          </IfPermission>
        )}
      />
      <Route
        path={`${LEDGERS_ROUTE}/:id/fiscalyear/create`}
        render={() => (
          <IfPermission perm="ui-finance.fiscal-year.create">
            {({ hasPermission }) => (hasPermission
              ? <CreateLedgerFiscalYear />
              : <NoPermissionsMessage />
            )}
          </IfPermission>
        )}
      />
      <Route
        path={`${LEDGERS_ROUTE}/:id/edit`}
        render={() => (
          <IfPermission perm="ui-finance.ledger.edit">
            {({ hasPermission }) => (hasPermission
              ? <EditLedger />
              : <NoPermissionsMessage />
            )}
          </IfPermission>
        )}
      />
      <Route
        path={LEDGERS_ROUTE}
        render={() => (
          <IfPermission perm="ui-finance.ledger.view">
            {({ hasPermission }) => (hasPermission
              ? <LedgerListContainer />
              : <NoPermissionsMessage />
            )}
          </IfPermission>
        )}
      />
    </Switch>
  );
};

export default withRouter(Ledger);
