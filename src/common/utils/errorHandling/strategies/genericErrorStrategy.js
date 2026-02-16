import { ERROR_CODE_GENERIC } from '@folio/stripes-acq-components';

export const genericErrorStrategy = ({
  callout,
  defaultErrorCode = ERROR_CODE_GENERIC, // Translation for this error code should be always available
  defaultMessage: defaultMessageProp,
  defaultMessageId,
  intl,
}) => {
  const handle = (errorsContainer) => {
    const responseError = errorsContainer.getError();
    const responseErrorCode = responseError.code;

    /*
      In case of generic error code, we use `defaultErrorCode` to show more specific message.
     */
    const errorCode = responseErrorCode === ERROR_CODE_GENERIC
      ? defaultErrorCode
      : responseErrorCode;

    const defaultMessage = (
      defaultMessageProp
      || (defaultMessageId && intl.formatMessage({ id: defaultMessageId }))
      || responseError.message
      || intl.formatMessage({ id: `ui-finance.errors.${defaultErrorCode}` }) // Should be used if specific error message is not defined
    );

    const errorMessage = intl.formatMessage({
      id: `ui-finance.errors.${errorCode}`,
      defaultMessage,
    });

    callout.sendCallout({
      message: errorMessage,
      type: 'error',
    });
  };

  return { handle };
};
