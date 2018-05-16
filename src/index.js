import React from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import Main from './components/Main';
import Settings from './settings';

class Finance extends React.Component {
  static propTypes = {
    match: PropTypes.object,
    showSettings: PropTypes.bool,
    stripes: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context);
    this.connectedApp = props.stripes.connect(Main);
  }

  render() {
    if (this.props.showSettings) {
      return <Settings {...this.props} />;
    }
    return (
      <Switch>
        <Route
          path={`${this.props.match.path}`}
          render={() => <this.connectedApp {...this.props} />}
        />
        <Route component={() => { this.NoMatch(); }} />
      </Switch>
    );
  }
}

export default Finance;
