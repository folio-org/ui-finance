import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';
import { LoadingPane } from '@folio/stripes/components';
import {
  ResponseErrorsContainer,
  SETTINGS_ENTRIES_API,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  NAVIGATION_SETTINGS_BROWSE_TAB_KEY,
  NAVIGATION_SETTINGS_SCOPE,
  useNavigationSettings,
} from '../../common/hooks';
import { FORM_FIELDS_NAMES } from './constants';
import NavigationSettingsForm from './NavigationSettingsForm';

export const NavigationSettings = () => {
  const stripes = useStripes();
  const ky = useOkapiKy();
  const sendCallout = useShowCallout();

  const isNonInteractive = !stripes.hasPerm('ui-finance.settings.all');

  const {
    navigationSettingsEntry,
    isBrowseTabEnabled,
    isLoading,
    refetch,
  } = useNavigationSettings();

  const onSubmit = useCallback(async (values) => {
    try {
      const payload = {
        id: navigationSettingsEntry?.id || uuidv4(),
        scope: NAVIGATION_SETTINGS_SCOPE,
        key: NAVIGATION_SETTINGS_BROWSE_TAB_KEY,
        value: values[FORM_FIELDS_NAMES.enabled],
      };

      const requestFn = navigationSettingsEntry
        ? () => ky.put(`${SETTINGS_ENTRIES_API}/${payload.id}`, { json: payload }).json()
        : () => ky.post(SETTINGS_ENTRIES_API, { json: payload }).json();

      await requestFn();

      sendCallout({ messageId: 'ui-finance.settings.navigation.submit.success' });
      refetch();
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
  }, [navigationSettingsEntry, ky, refetch, sendCallout]);

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
