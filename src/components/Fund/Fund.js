import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import queryString from 'query-string';

import FundDetails from './FundDetails';
import FundForm from './FundForm';

const Fund = (props) => {
  const { layer } = queryString.parse(props.location.search);

  return (
    <Switch>
      <Route
        exact
        path={props.match.path}
        render={
          () => {
            return layer === 'edit'
              ? <FundForm {...props} />
              : <FundDetails {...props} />;
          }
        }
      />
    </Switch>
  );
};

Fund.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};

export default Fund;
