import React, { useCallback } from 'react';
import { Field, useForm } from 'react-final-form';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import {
  Checkbox,
} from '@folio/stripes/components';

function RolloverField({ rollover, elem }) {
  const { batch, change, resetFieldState } = useForm();
  const intl = useIntl();

  const onChange = useCallback(() => {
    if (rollover) {
      resetFieldState(`${elem}.basedOn`);
      batch(() => {
        change(`${elem}.rollover`, false);
        change(`${elem}.basedOn`, undefined);
        change(`${elem}.increaseBy`, undefined);
      });
    } else {
      change(`${elem}.rollover`, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rollover]);

  return (
    <Field
      component={Checkbox}
      aria-label={intl.formatMessage({ id: 'ui-finance.ledger.rollover.rollover' })}
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
