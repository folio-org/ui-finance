import React from 'react';
import { FormattedMessage } from 'react-intl';

// eslint-disable-next-line import/prefer-default-export
export const validateFund = (value, { fromFundId, toFundId }) => (
  fromFundId === toFundId
    ? <FormattedMessage id="ui-finance.transaction.fundValidation" />
    : undefined
);
