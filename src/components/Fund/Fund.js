import React from 'react';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
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
