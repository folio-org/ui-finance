import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import { Pane, Paneset } from '@folio/stripes/components';

export default class Application extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
  }

  render() {
    return (
      <Paneset>
        <Pane defaultWidth="fill" fluidContentWidth paneTitle="ui-finance">
          <br />
          <ul>
            <li>
              View the
              {' '}
              <Link to={`${this.props.match.path}/examples`}>examples page</Link>
              {' '}
              to see some useful components.
            </li>
            <li>
              Please refer to the
              {' '}
              <a href="https://github.com/folio-org/stripes-core/blob/master/doc/dev-guide.md">Stripes Module Developers Guide</a>
              {' '}
              for more information.
            </li>
          </ul>
        </Pane>
      </Paneset>
    );
  }
}
