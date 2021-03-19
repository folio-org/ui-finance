import React, { useCallback } from 'react';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { useOkapiKy } from '@folio/stripes/core';
import { TextField } from '@folio/stripes/components';

import { validateDuplicateFieldValue } from '../../../common/utils';
import { LEDGERS_API } from '../../../common/const';

const FieldLedgerCode = ({ ledgerId }) => {
  const ky = useOkapiKy();

  const validate = useCallback(
    (fieldValue) => {
      const errorMessage = <FormattedMessage id="ui-finance.ledger.code.isInUse" />;
      const params = {
        ky,
        api: LEDGERS_API,
        id: ledgerId,
        fieldValue,
        errorMessage,
        fieldName: 'code',
      };

      return validateDuplicateFieldValue(params);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ledgerId],
  );

  return (
    <Field
      component={TextField}
      label={<FormattedMessage id="ui-finance.ledger.code" />}
      name="code"
      type="text"
      required
      validate={validate}
      validateFields={[]}
    />
  );
};

FieldLedgerCode.propTypes = {
  ledgerId: PropTypes.string,
};

export default FieldLedgerCode;
