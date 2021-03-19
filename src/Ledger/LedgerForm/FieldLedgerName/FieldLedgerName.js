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
    (fieldValue) => {
      const errorMessage = <FormattedMessage id="ui-finance.ledger.name.isInUse" />;
      const params = {
        ky,
        api: LEDGERS_API,
        id: ledgerId,
        fieldValue,
        errorMessage,
        fieldName: 'name',
      };

      return validateDuplicateFieldValue(params);
    },
    [ledgerId],
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
