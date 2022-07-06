import React, { useCallback, useState } from 'react';
import { FORM_ERROR } from 'final-form';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  ERROR_CODE_CONFLICT,
  getErrorCodeFromResponse,
  useShowCallout,
} from '@folio/stripes-acq-components';

export const useSaveFiscalYear = (mutator, onSave, method = 'POST') => {
  const showCallout = useShowCallout();
  const intl = useIntl();
  const [error, setError] = useState();

  const saveFiscalYear = useCallback(
    async (fiscalYearValues) => {
      try {
        const savedFiscalYear = await mutator[method](fiscalYearValues);

        showCallout({
          messageId: 'ui-finance.fiscalYear.actions.save.success',
        });
        onSave(savedFiscalYear);

        return undefined;
      } catch (response) {
        const errorCode = await getErrorCodeFromResponse(response);

        if (errorCode === ERROR_CODE_CONFLICT) {
          setError(errorCode);
        } else {
          const errorMessage = (
            <FormattedMessage
              id={`ui-finance.fiscalYear.actions.save.error.${errorCode}`}
              defaultMessage={intl.formatMessage({ id: 'ui-finance.fiscalYear.actions.save.error.genericError' })}
            />
          );

          showCallout({
            message: errorMessage,
            type: 'error',
          });
        }

        return { [FORM_ERROR]: 'FY was not saved' };
      }
    },
    [method, onSave, showCallout],
  );

  return { saveFiscalYear, error };
};
