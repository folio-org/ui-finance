import React, { useCallback } from 'react';
import { Field, useForm } from 'react-final-form';
import PropTypes from 'prop-types';

import {
  Checkbox,
} from '@folio/stripes/components';

function RolloverField({ rollover, elem }) {
  const { batch, change, resetFieldState } = useForm();

  const onChange = useCallback(() => {
    if (rollover) {
      resetFieldState(`${elem}.basedOn`);
      batch(() => {
        change(`${elem}.rollover`, !rollover);
        change(`${elem}.basedOn`, undefined);
        change(`${elem}.increaseBy`, undefined);
      });
    } else {
      change(`${elem}.rollover`, !rollover);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rollover]);

  return (
    <Field
      component={Checkbox}
      label={null}
      name={`${elem}.rollover`}
      onChange={onChange}
      type="checkbox"
      validateFields={[`${elem}.basedOn`, `${elem}.increaseBy`]}
      vertical
    />
  );
}

RolloverField.propTypes = {
  elem: PropTypes.string.isRequired,
  rollover: PropTypes.bool,
};

RolloverField.defaultProps = {
  rollover: false,
};

export default RolloverField;
