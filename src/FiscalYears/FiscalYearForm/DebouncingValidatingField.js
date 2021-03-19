import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';

class DebouncingValidatingField extends Component {
  validate = (...args) => (
    new Promise(resolve => {
      if (this.clearTimeout) this.clearTimeout();
      const timerId = setTimeout(() => {
        resolve(this.props.validate(...args));
      }, this.props.debounce);

      this.clearTimeout = () => {
        clearTimeout(timerId);
        resolve();
      };
    })
  )

  render() {
    return <Field {...this.props} validate={this.validate} />;
  }
}

DebouncingValidatingField.propTypes = {
  debounce: PropTypes.number,
  validate: PropTypes.func,
};
DebouncingValidatingField.defaultProps = {
  debounce: 1000,
};

export default DebouncingValidatingField;
