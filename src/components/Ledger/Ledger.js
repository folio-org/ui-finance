import React from 'react';
import {
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import EditLedger from './EditLedger';
import LedgerList from './LedgerList';

const Ledger = ({ match }) => {
  return (
    <Switch>
      <Route
        path={`${match.url}/edit/:id`}
        component={EditLedger}
      />
      <Route
        path={match.url}
        component={LedgerList}
      />
    </Switch>
  );
};

Ledger.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default withRouter(Ledger);
