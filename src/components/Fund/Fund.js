import React from 'react';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import ReactRouterPropTypes from 'react-router-prop-types';

import FundDetails from './FundDetails';

const Fund = (props) => (
  <Switch>
    <Route
      path={props.match.path}
      render={
        () => (
          <FundDetails
            {...props}
          />
        )
      }
    />
  </Switch>
);

Fund.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default Fund;
