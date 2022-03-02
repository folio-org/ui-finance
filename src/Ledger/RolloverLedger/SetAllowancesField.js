import React, { useCallback } from 'react';
import { Field, useForm } from 'react-final-form';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import {
  Checkbox,
} from '@folio/stripes/components';

function SetAllowancesField({ setAllowances, elem }) {
  const { batch, change } = useForm();
  const intl = useIntl();

  const onChange = useCallback(() => {
    if (setAllowances) {
      batch(() => {
        change(`${elem}.setAllowances`, false);
        change(`${elem}.allowableEncumbrance`, undefined);
        change(`${elem}.allowableExpenditure`, undefined);
      });
    } else {
      change(`${elem}.setAllowances`, true);
    }
  }, [elem, setAllowances]);

  return (
    <Field
      component={Checkbox}
      aria-label={intl.formatMessage({ id: 'ui-finance.ledger.rollover.setAllowances' })}
      name={`${elem}.setAllowances`}
      onChange={onChange}
      type="checkbox"
      validateFields={[`${elem}.allowableEncumbrance`, `${elem}.allowableExpenditure`]}
      vertical
    />
  );
}

SetAllowancesField.propTypes = {
  elem: PropTypes.string.isRequired,
  setAllowances: PropTypes.bool,
};

SetAllowancesField.defaultProps = {
  setAllowances: false,
};

export default SetAllowancesField;
