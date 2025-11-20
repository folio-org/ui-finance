import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { Field, useForm } from 'react-final-form';
import { useIntl } from 'react-intl';

import { Checkbox } from '@folio/stripes/components';

function SetAllowancesField({
  elem,
  setAllowances = false,
}) {
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
  }, [batch, change, elem, setAllowances]);

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

export default SetAllowancesField;
