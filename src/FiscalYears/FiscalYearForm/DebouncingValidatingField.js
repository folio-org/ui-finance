import PropTypes from 'prop-types';
import {
  useCallback,
  useRef,
} from 'react';
import { Field } from 'react-final-form';

const DebouncingValidatingField = ({
  debounce = 1000,
  validate,
  ...props
}) => {
  const timeoutRef = useRef(null);

  const debouncedValidate = useCallback((...args) => {
    return new Promise(resolve => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        resolve(validate(...args));
      }, debounce);
    });
  }, [validate, debounce]);

  return <Field {...props} validate={debouncedValidate} />;
};

DebouncingValidatingField.propTypes = {
  debounce: PropTypes.number,
  validate: PropTypes.func,
};

export default DebouncingValidatingField;
