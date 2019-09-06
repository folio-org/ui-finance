import React from 'react';
import {
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import FiscalYearsList from './FiscalYearsList';

const FiscalYear = ({ match }) => {
  return (
    <Switch>
      <Route
        path={match.url}
        component={FiscalYearsList}
      />
    </Switch>
  );
};

FiscalYear.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default withRouter(FiscalYear);
