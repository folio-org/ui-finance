import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import { useOkapiKy } from '@folio/stripes/core';
import {
  ERROR_CODE_CONFLICT,
  ERROR_CODE_GENERIC,
  getErrorCodeFromResponse,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  FISCAL_YEARS_API,
  LEDGER_ROLLOVER_API,
} from '../../../../common/const';

const invalidReference = <FormattedMessage id="stripes-acq-components.invalidReference" />;

const rolloverConflictHandler = async ({ ledger, currentFiscalYear }, ky) => {
  const searchParams = {
    query: `(ledgerId=="${ledger.id}" and fromFiscalYearId=="${currentFiscalYear.id}")`,
  };

  const existingLedgerRollover = await ky.get(LEDGER_ROLLOVER_API, { searchParams })
    .json()
    .then(({ ledgerFiscalYearRollovers }) => ledgerFiscalYearRollovers[0])
    .catch(() => ({}));

  const rolledToFY = await ky.get(`${FISCAL_YEARS_API}/${existingLedgerRollover.toFiscalYearId}`)
    .json()
    .catch(() => ({}));

  return {
    messageId: 'ui-finance.ledger.rollover.error.conflict',
    values: {
      ledgerName: ledger.name,
      fromFYcode: currentFiscalYear.code,
      toFYcode: rolledToFY.code || invalidReference,
    },
  };
};

const errorHandlersMap = {
  [ERROR_CODE_CONFLICT]: rolloverConflictHandler,
  [ERROR_CODE_GENERIC]: () => ({ messageId: 'ui-finance.ledger.rollover.errorExecute' }),
};

export const useRolloverErrorHandler = ({ ledger, currentFiscalYear }) => {
  const ky = useOkapiKy();
  const showCallout = useShowCallout();

  const handleRolloverErrors = useCallback(async (response) => {
    const errorCode = await getErrorCodeFromResponse(response);
    const handler = errorHandlersMap[errorCode] || errorHandlersMap[ERROR_CODE_GENERIC];
    const errorPayload = await handler({ ledger, currentFiscalYear }, ky);

    showCallout({ ...errorPayload, type: 'error' });
  }, [currentFiscalYear, ky, ledger, showCallout]);

  return handleRolloverErrors;
};
