import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Route from 'react-router-dom/Route';
import _ from "lodash";
import queryString from 'query-string';

class View extends Component {
  render() {
    return (
    <div style={{width: '100%'}}>
      <h1>This is view page</h1>
      <p>Test</p>
    </div>
    )
  }
}

export default View;