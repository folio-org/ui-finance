import React from 'react';
import {
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';

import { PermissionedRoute } from '@folio/stripes-acq-components';

import CheckPermission from '../common/CheckPermission';
import {
  LEDGER_CREATE_ROUTE,
  LEDGERS_ROUTE,
} from '../common/const';
import { EditLedger } from './EditLedger';
import { CreateLedger } from './CreateLedger';
import { CreateLedgerFiscalYear } from './CreateLedgerFiscalYear';
import { LedgerListContainer } from './LedgerList';
import RolloverLedgerContainer from './RolloverLedger';
import RolloverLedgerCreateFiscalYear from './RolloverLedgerCreateFiscalYear';

const Ledger = () => {
  return (
    <Switch>
      <Route
        path={LEDGER_CREATE_ROUTE}
        render={() => (
          <CheckPermission perm="ui-finance.ledger.create">
            <CreateLedger />
          </CheckPermission>
        )}
      />
      <Route
        path={`${LEDGERS_ROUTE}/fiscalyear/create`}
        render={() => (
          <CheckPermission perm="ui-finance.fiscal-year.create">
            <CreateLedgerFiscalYear />
          </CheckPermission>
        )}
      />
      <Route
        path={`${LEDGERS_ROUTE}/:id/fiscalyear/create`}
        render={() => (
          <CheckPermission perm="ui-finance.fiscal-year.create">
            <CreateLedgerFiscalYear />
          </CheckPermission>
        )}
      />
      <Route
        path={`${LEDGERS_ROUTE}/:id/edit`}
        render={() => (
          <CheckPermission perm="ui-finance.ledger.edit">
            <EditLedger />
          </CheckPermission>
        )}
      />
      <PermissionedRoute
        path={`${LEDGERS_ROUTE}/:id/rollover-create-fy`}
        perm="ui-finance.fiscal-year.create"
        returnLink={LEDGERS_ROUTE}
        returnLinkLabelId="ui-finance.ledger"
      >
        <RolloverLedgerCreateFiscalYear />
      </PermissionedRoute>
      <PermissionedRoute
        path={`${LEDGERS_ROUTE}/:id/rollover`}
        perm="ui-finance.ledger.rollover"
        returnLink={LEDGERS_ROUTE}
        returnLinkLabelId="ui-finance.ledger"
      >
        <RolloverLedgerContainer />
      </PermissionedRoute>
      <Route
        path={LEDGERS_ROUTE}
        render={() => (
          <CheckPermission perm="ui-finance.ledger.view">
            <LedgerListContainer />
          </CheckPermission>
        )}
      />
    </Switch>
  );
};

export default withRouter(Ledger);
