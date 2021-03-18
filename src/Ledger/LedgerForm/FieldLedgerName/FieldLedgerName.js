import React, { useCallback } from 'react';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { useOkapiKy } from '@folio/stripes/core';
import { TextField } from '@folio/stripes/components';

import { validateDuplicateFieldValue } from '../../../common/utils';
import { LEDGERS_API } from '../../../common/const';

const FieldLedgerName = ({ ledgerId }) => {
  const ky = useOkapiKy();

  const validate = useCallback(
    (value) => {
      const errorMessage = <FormattedMessage id="ui-finance.ledger.name.isInUse" />;

      return validateDuplicateFieldValue(ky, LEDGERS_API, ledgerId, value, errorMessage, 'name');
    },
    [ledgerId, ky],
  );

  return (
    <Field
      component={TextField}
      label={<FormattedMessage id="ui-finance.ledger.name" />}
      name="name"
      type="text"
      required
      validate={validate}
      validateFields={[]}
    />
  );
};

FieldLedgerName.propTypes = {
  ledgerId: PropTypes.string,
};

export default FieldLedgerName;
