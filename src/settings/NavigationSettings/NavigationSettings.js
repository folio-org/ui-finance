import {
  useCallback,
  useState,
  useEffect,
} from 'react';

import { useStripes } from '@folio/stripes/core';
import { useShowCallout } from '@folio/stripes-acq-components';

import { FORM_FIELDS_NAMES } from './constants';
import NavigationSettingsForm from './NavigationSettingsForm';

const BROWSE_TAB_STORAGE_KEY = 'ui-finance-browse-tab-enabled';

const DEFAULT_VALUES = {
  [FORM_FIELDS_NAMES.enabled]: false,
};

// Helper to get stored value
const getStoredSettings = () => {
  try {
    const stored = localStorage.getItem(BROWSE_TAB_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to parse navigation settings from localStorage:', e);
  }
  return null;
};

// Helper to save value
const saveSettings = (values) => {
  try {
    localStorage.setItem(BROWSE_TAB_STORAGE_KEY, JSON.stringify(values));
    return true;
  } catch (e) {
    console.error('Failed to save navigation settings to localStorage:', e);
    return false;
  }
};

// Export this so other components can check if browse is enabled
export const isBrowseTabEnabled = () => {
  const settings = getStoredSettings();
  return settings?.[FORM_FIELDS_NAMES.enabled] ?? false;
};

export const NavigationSettings = () => {
  const stripes = useStripes();
  const sendCallout = useShowCallout();
  const [navigationSettings, setNavigationSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isNonInteractive = !stripes.hasPerm('ui-finance.settings.all');

  // Load settings from localStorage on mount
  useEffect(() => {
    const stored = getStoredSettings();
    setNavigationSettings(stored);
    setIsLoading(false);
  }, []);

  const onSubmit = useCallback((values) => {
    const success = saveSettings(values);

    if (success) {
      setNavigationSettings(values);
      sendCallout({ messageId: 'ui-finance.settings.navigation.submit.success' });
      // Dispatch a custom event so other components can react to the change
      window.dispatchEvent(new CustomEvent('browse-tab-settings-changed', { detail: values }));
    } else {
      sendCallout({
        type: 'error',
        messageId: 'ui-finance.settings.navigation.submit.error.generic',
      });
    }
  }, [sendCallout]);

  if (isLoading) {
    return null;
  }

  return (
    <NavigationSettingsForm
      onSubmit={onSubmit}
      initialValues={navigationSettings || DEFAULT_VALUES}
      isNonInteractive={isNonInteractive}
    />
  );
};

