import { useCallback } from 'react';

import { useStripes } from '@folio/stripes/core';
import { LoadingPane } from '@folio/stripes/components';
import {
  ERROR_CODE_GENERIC,
  ResponseErrorsContainer,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { useNavigationSettings } from '../../common/hooks';
import { FORM_FIELDS_NAMES } from './constants';
import NavigationSettingsForm from './NavigationSettingsForm';

export const NavigationSettings = () => {
  const stripes = useStripes();
  const sendCallout = useShowCallout();

  const isNonInteractive = !stripes.hasPerm('ui-finance.settings.all');

  const {
    isBrowseTabEnabled,
    isLoading,
    saveNavigationSettings,
  } = useNavigationSettings();

  const onSubmit = useCallback(async (values) => {
    try {
      await saveNavigationSettings(values[FORM_FIELDS_NAMES.enabled]);

      sendCallout({ messageId: 'ui-finance.settings.navigation.submit.success' });
    } catch (error) {
      const { handler } = await ResponseErrorsContainer.create(error?.response);
      const structuredError = handler.getError();

      // a plain-text response (e.g. a raw 403 from Okapi) fails JSON.parse and
      // ends up here as a generic code, so don't show that message as-is
      const errorMessage = structuredError.code !== ERROR_CODE_GENERIC
        ? structuredError.message
        : undefined;

      sendCallout({
        type: 'error',
        ...(
          errorMessage
            ? { message: errorMessage }
            : { messageId: 'ui-finance.settings.navigation.submit.error.generic' }
        ),
      });
    }
  }, [saveNavigationSettings, sendCallout]);

  if (isLoading) {
    return <LoadingPane />;
  }

  return (
    <NavigationSettingsForm
      onSubmit={onSubmit}
      initialValues={{ [FORM_FIELDS_NAMES.enabled]: isBrowseTabEnabled }}
      isNonInteractive={isNonInteractive}
    />
  );
};
