import React from 'react';
import { FormattedMessage } from 'react-intl';

import { validateRequired } from '@folio/stripes-acq-components';

export const validateFund = (value, { fromFundId, toFundId }) => {
  const validateRequiredMessage = validateRequired(value);

  if (validateRequiredMessage) return validateRequiredMessage;

  return (
    fromFundId === toFundId
      ? <FormattedMessage id="ui-finance.transaction.fundValidation" />
      : undefined
  );
};
