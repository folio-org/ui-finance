import { useCallback } from 'react';
import { SubmissionError } from 'redux-form';

import {
  useShowCallout,
} from '@folio/stripes-acq-components';

export const useSaveFiscalYear = (mutator, onSave, method = 'POST') => {
  const showCallout = useShowCallout();

  const saveFiscalYear = useCallback(
    async (fiscalYearValues) => {
      try {
        const savedFiscalYear = await mutator[method](fiscalYearValues);

        showCallout({
          messageId: 'ui-finance.fiscalYear.actions.save.success',
        });
        setTimeout(() => onSave(savedFiscalYear.id), 0);

        return savedFiscalYear;
      } catch (response) {
        let errorCode = null;

        try {
          const responseJson = await response.json();

          errorCode = responseJson?.errors?.[0]?.code || 'genericError';
        } catch (parsingException) {
          errorCode = 'genericError';
        }
        showCallout({
          messageId: `ui-finance.fiscalYear.actions.save.error.${errorCode}`,
          type: 'error',
        });
        throw new SubmissionError({
          _error: 'FY was not saved',
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [method, onSave, showCallout],
  );

  return saveFiscalYear;
};
