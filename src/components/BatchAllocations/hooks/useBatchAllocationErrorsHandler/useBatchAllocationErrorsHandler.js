import { useCallback } from 'react';
import { useIntl } from 'react-intl';

import { useShowCallout } from '@folio/stripes-acq-components';

import { handleBatchAllocationResponseError } from '../../handleBatchAllocationResponseError';

export const useBatchAllocationErrorsHandler = () => {
  const intl = useIntl();
  const showCallout = useShowCallout();

  const handle = useCallback((error) => {
    if (error?.response) {
      return handleBatchAllocationResponseError(error.response, showCallout, intl);
    }

    const message = error?.message || intl.formatMessage({ id: 'ui-finance.actions.allocations.batch.error' });

    return showCallout({
      message,
      type: 'error',
    });
  }, [intl, showCallout]);

  return { handle };
};
