import { FormattedMessage } from 'react-intl';

import {
  ERROR_CODE_GENERIC,
  getErrorCodeFromResponse,
} from '@folio/stripes-acq-components';

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

export const handleRecalculateTotalsErrorResponse = async (intl, showCallout, response) => {
  const errorCode = await getErrorCodeFromResponse(response);

  const message = (
    <FormattedMessage
      id={`ui-finance.budget.actions.recalculateTotals.error.${errorCode}`}
      defaultMessage={intl.formatMessage({ id: `ui-finance.budget.actions.recalculateTotals.error.${ERROR_CODE_GENERIC}` })}
    />
  );

  showCallout({
    message,
    type: 'error',
  });
};
