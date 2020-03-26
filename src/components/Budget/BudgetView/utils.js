import React from 'react';
import { FormattedMessage } from 'react-intl';

import { ERROR_CODE_GENERIC } from '@folio/stripes-acq-components';

export const handleRemoveErrorResponse = async (intl, showCallout, response) => {
  let errorCode = null;

  try {
    const responseJson = await response.json();

    errorCode = responseJson?.errors?.[0]?.code || ERROR_CODE_GENERIC;
  } catch (parsingException) {
    errorCode = ERROR_CODE_GENERIC;
  }

  const message = (
    <FormattedMessage
      id={`ui-finance.budget.actions.remove.error.${errorCode}`}
      defaultMessage={intl.formatMessage({ id: `ui-finance.budget.actions.remove.error.${ERROR_CODE_GENERIC}` })}
    />
  );

  showCallout({
    message,
    type: 'error',
  });
};
