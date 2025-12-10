import { useCallback } from 'react';

import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';
import { LoadingPane } from '@folio/stripes/components';
import {
  ResponseErrorsContainer,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { FORM_FIELDS_NAMES } from './constants';
import NavigationSettingsForm from './NavigationSettingsForm';

const DEFAULT_VALUES = {
  [FORM_FIELDS_NAMES.enabled]: false,
};

// TODO: Replace with actual API endpoint when available
const NAVIGATION_SETTINGS_API = '/finance/navigation-settings';

export const NavigationSettings = () => {
  const stripes = useStripes();
  const ky = useOkapiKy();
  const sendCallout = useShowCallout();

  const isNonInteractive = !stripes.hasPerm('ui-finance.settings.all');

  // TODO: Replace with actual hook when API is available
  // For now, using a simple state
  const isLoading = false;
  const navigationSettings = null;

  const onSubmit = useCallback(async (values) => {
    try {
      const requestFn = navigationSettings
        ? () => ky.put(`${NAVIGATION_SETTINGS_API}/${navigationSettings.id}`, { json: values }).json()
        : () => ky.post(NAVIGATION_SETTINGS_API, { json: values }).json();

      await requestFn();

      sendCallout({ messageId: 'ui-finance.settings.navigation.submit.success' });
    } catch (error) {
      const { handler } = await ResponseErrorsContainer.create(error?.response);

      const errorMessage = handler.getError().message;

      sendCallout({
        type: 'error',
        ...(
          errorMessage
            ? { message: errorMessage }
            : { messageId: 'ui-finance.settings.navigation.submit.error.generic' }
        ),
      });
    }
  }, [navigationSettings, ky, sendCallout]);

  if (isLoading) {
    return <LoadingPane />;
  }

  return (
    <NavigationSettingsForm
      onSubmit={onSubmit}
      initialValues={navigationSettings || DEFAULT_VALUES}
      isNonInteractive={isNonInteractive}
    />
  );
};

