import { useCallback } from 'react';

import {
  ERROR_CODE_CONFLICT,
  ERROR_CODE_GENERIC,
  getErrorCodeFromResponse,
  useShowCallout,
} from '@folio/stripes-acq-components';

const errorHandlersMap = {
  [ERROR_CODE_CONFLICT]: ({ currentFiscalYear, ledger }) => ({
    messageId: 'ui-finance.ledger.rollover.error.conflict',
    values: {
      name: ledger.name,
      code: currentFiscalYear.code,
    },
  }),
  [ERROR_CODE_GENERIC]: () => ({ messageId: 'ui-finance.ledger.rollover.errorExecute' }),
};

export const useRolloverErrorHandler = ({ ledger, currentFiscalYear }) => {
  const showCallout = useShowCallout();

  const handleRolloverErrors = useCallback(async (response) => {
    const errorCode = await getErrorCodeFromResponse(response);
    const handler = errorHandlersMap[errorCode] || errorHandlersMap[ERROR_CODE_GENERIC];
    const errorPayload = handler({ ledger, currentFiscalYear });

    showCallout({ ...errorPayload, type: 'error' });
  }, [currentFiscalYear, ledger, showCallout]);

  return handleRolloverErrors;
};
