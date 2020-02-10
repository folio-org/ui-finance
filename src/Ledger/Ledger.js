import React from 'react';
import {
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import { EditLedger } from './EditLedger';
import { CreateLedger } from './CreateLedger';
import { LedgerListContainer } from './LedgerList';

const Ledger = ({ match }) => {
  return (
    <Switch>
      <Route
        path={`${match.url}/create`}
        render={CreateLedger}
      />
      <Route
        path={`${match.url}/:id/edit`}
        render={EditLedger}
      />

      <Route
        path={match.url}
        render={LedgerListContainer}
      />
    </Switch>
  );
};

Ledger.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default withRouter(Ledger);
