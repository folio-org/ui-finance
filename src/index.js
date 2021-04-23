/* eslint-disable filenames/match-exported */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  Switch,
} from 'react-router-dom';

import {
  checkScope,
  CommandList,
  defaultKeyboardShortcuts,
  HasCommand,
} from '@folio/stripes/components';

import Main from './components/Main';

import Settings from './settings';

class Finance extends React.Component {
  static propTypes = {
    match: PropTypes.object,
    showSettings: PropTypes.bool,
    stripes: PropTypes.object,
    history: PropTypes.object,
  }

  focusSearchField = () => {
    const el = document.getElementById('input-record-search');

    if (el) {
      el.focus();
    }
  }

  shortcuts = [
    {
      name: 'search',
      handler: this.focusSearchField,
    },
  ];

  render() {
    if (this.props.showSettings) {
      return <Settings {...this.props} />;
    }

    return (
      <CommandList commands={defaultKeyboardShortcuts}>
        <HasCommand
          commands={this.shortcuts}
          isWithinScope={checkScope}
          scope={document.body}
        >
          <Switch>
            <Route
              path={`${this.props.match.path}`}
              render={() => <Main {...this.props} />}
            />
            <Route component={() => { this.NoMatch(); }} />
          </Switch>
        </HasCommand>
      </CommandList>
    );
  }
}

export default Finance;
