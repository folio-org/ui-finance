import { ERROR_CODE_GENERIC } from '@folio/stripes-acq-components';

export const handleRemoveErrorResponse = async (showCallout, response) => {
  let errorCode = null;

  try {
    const responseJson = await response.json();

    errorCode = responseJson?.errors?.[0]?.code || ERROR_CODE_GENERIC;
  } catch (parsingException) {
    errorCode = ERROR_CODE_GENERIC;
  }

  showCallout({
    messageId: `ui-finance.budget.actions.remove.error.${errorCode}`,
    type: 'error',
  });
};
