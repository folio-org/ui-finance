import React from 'react';
import { FormattedMessage } from 'react-intl';

// eslint-disable-next-line react/prop-types
export const validateTransactionForm = ({ fromFundId, fundId, toFundId }) => {
  if (!fromFundId && !toFundId) {
    return {
      fromFundId: <FormattedMessage id="stripes-acq-components.validation.required" />,
      toFundId: <FormattedMessage id="stripes-acq-components.validation.required" />,
    };
  }

  if (fromFundId === toFundId) {
    return { toFundId: <FormattedMessage id="ui-finance.transaction.fundValidation" /> };
  }

  if (fromFundId !== fundId && toFundId !== fundId) {
    return {
      fromFundId: <FormattedMessage id="ui-finance.transaction.fundValidation2" />,
      toFundId: <FormattedMessage id="ui-finance.transaction.fundValidation2" />,
    };
  }

  return {};
};
