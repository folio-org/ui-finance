import { useState, useEffect, useCallback } from 'react';

const BROWSE_TAB_STORAGE_KEY = 'ui-finance-browse-tab-enabled';

/**
 * Custom hook to check if the Browse tab is enabled.
 * Reads from localStorage and listens for changes.
 *
 * @returns {boolean} - Whether the browse tab is enabled
 */
const useBrowseTabEnabled = () => {
  const [isEnabled, setIsEnabled] = useState(() => {
    try {
      const stored = localStorage.getItem(BROWSE_TAB_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed?.enabled ?? false;
      }
    } catch (e) {
      console.warn('Failed to parse browse tab settings:', e);
    }
    return false;
  });

  const handleStorageChange = useCallback((event) => {
    // Handle custom event from NavigationSettings
    if (event.type === 'browse-tab-settings-changed') {
      setIsEnabled(event.detail?.enabled ?? false);
      return;
    }

    // Handle storage event from other tabs
    if (event.key === BROWSE_TAB_STORAGE_KEY) {
      try {
        const newValue = event.newValue ? JSON.parse(event.newValue) : null;
        setIsEnabled(newValue?.enabled ?? false);
      } catch (e) {
        console.warn('Failed to parse browse tab settings:', e);
      }
    }
  }, []);

  useEffect(() => {
    // Listen for storage changes (cross-tab)
    window.addEventListener('storage', handleStorageChange);
    // Listen for custom event (same tab)
    window.addEventListener('browse-tab-settings-changed', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('browse-tab-settings-changed', handleStorageChange);
    };
  }, [handleStorageChange]);

  return isEnabled;
};

export default useBrowseTabEnabled;

