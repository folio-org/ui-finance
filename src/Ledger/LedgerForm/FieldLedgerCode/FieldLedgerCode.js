import React, { useCallback } from 'react';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import { TextField } from '@folio/stripes/components';

import { ledgersResource } from '../../../common/resources';
import { validateLedger } from '../validateLedger';

const FieldLedgerCode = ({ ledgerId, mutator }) => {
  const validate = useCallback(value => {
    return validateLedger(mutator.ledgers, ledgerId, value, 'code');
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [ledgerId]);

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

FieldLedgerCode.manifest = Object.freeze({
  ledgers: {
    ...ledgersResource,
    fetch: false,
    accumulate: true,
  },
});

FieldLedgerCode.propTypes = {
  mutator: PropTypes.object.isRequired,
  ledgerId: PropTypes.string,
};

export default stripesConnect(FieldLedgerCode);
