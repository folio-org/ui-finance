import { useCallback } from 'react';

import { useOkapiKy } from '@folio/stripes/core';
import { LoadingPane } from '@folio/stripes/components';
import {
  EXCHANGE_RATE_SOURCE_API,
  ResponseErrorsContainer,
  useExchangeRateSource,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { FORM_FIELDS_NAMES } from './constants';
import ExchangeRateSourceForm from './ExchangeRateSourceForm';

const DEFAULT_VALUES = {
  [FORM_FIELDS_NAMES.enabled]: false,
};

export const ExchangeRateSourceSettings = () => {
  const ky = useOkapiKy();
  const sendCallout = useShowCallout();

  const {
    exchangeRateSource,
    isLoading,
    refetch,
  } = useExchangeRateSource();

  const onSubmit = useCallback(async (values) => {
    try {
      const requestFn = exchangeRateSource
        ? () => ky.put(`${EXCHANGE_RATE_SOURCE_API}/${exchangeRateSource.id}`, { json: values }).json()
        : () => ky.post(EXCHANGE_RATE_SOURCE_API, { json: values }).json();

      await requestFn();

      sendCallout({ messageId: 'ui-finance.settings.exchangeRateSource.submit.success' });
      refetch();
    } catch (error) {
      const { handler } = await ResponseErrorsContainer.create(error?.response);

      const errorMessage = handler.getError().message;

      sendCallout({
        type: 'error',
        ...(
          errorMessage
            ? { message: errorMessage }
            : { messageId: 'ui-finance.settings.exchangeRateSource.submit.error.generic' }
        ),
      });
    }
  }, [exchangeRateSource, ky, refetch, sendCallout]);

  if (isLoading) {
    return <LoadingPane />;
  }

  return (
    <ExchangeRateSourceForm
      onSubmit={onSubmit}
      initialValues={exchangeRateSource || DEFAULT_VALUES}
    />
  );
};
