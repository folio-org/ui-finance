import { useCallback } from 'react';
import { useIntl } from 'react-intl';

import { useShowCallout } from '@folio/stripes-acq-components';

import { handleCommonErrorResponse } from '../../utils';

export const useCommonErrorResponseHandler = () => {
  const sendCallout = useShowCallout();
  const intl = useIntl();

  const handle = useCallback((e, options = {}) => {
    const params = {
      callout: { sendCallout },
      intl,
      ...options,
    };

    return handleCommonErrorResponse(e, params);
  }, [sendCallout, intl]);

  return { handle };
};
