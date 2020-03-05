/* eslint-disable filenames/match-exported */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  Switch,
} from 'react-router-dom';

import Main from './components/Main';
import Settings from './settings';

class Finance extends React.Component {
  static propTypes = {
    match: PropTypes.object,
    showSettings: PropTypes.bool,
    stripes: PropTypes.object,
  }

  render() {
    if (this.props.showSettings) {
      return <Settings {...this.props} />;
    }

    return (
      <Switch>
        <Route
          path={`${this.props.match.path}`}
          render={() => <Main {...this.props} />}
        />
        <Route component={() => { this.NoMatch(); }} />
      </Switch>
    );
  }
}

export default Finance;
