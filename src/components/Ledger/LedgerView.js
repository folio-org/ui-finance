import React, { Component } from 'react';
import { Field, FieldArray } from 'redux-form';
import _ from 'lodash';
import PropTypes from 'prop-types';
// Components and Pages

class LedgerView extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <p>this is the view</p>
      </div>
    )
  }
}

export default LedgerView;
