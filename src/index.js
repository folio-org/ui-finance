import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';

import {
  ToastContext,
} from '@folio/stripes-acq-components';
import { Callout } from '@folio/stripes/components';

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

    this.callout = React.createRef();
  }

  render() {
    if (this.props.showSettings) {
      return <Settings {...this.props} />;
    }
    return (
      <Fragment>
        <ToastContext.Provider value={this.callout}>
          <Switch>
            <Route
              path={`${this.props.match.path}`}
              render={() => <Main {...this.props} />}
            />
            <Route component={() => { this.NoMatch(); }} />
          </Switch>
        </ToastContext.Provider>
        <Callout ref={this.callout} />
      </Fragment>
    );
  }
}

export default Finance;
