import { useQuery } from 'react-query';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { SETTINGS_ENTRIES_API } from '@folio/stripes-acq-components';

export const NAVIGATION_SETTINGS_SCOPE = 'ui-finance';
export const NAVIGATION_SETTINGS_BROWSE_TAB_KEY = 'enableBrowseTab';

export const useNavigationSettings = (options = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'navigation-settings' });

  const queryKey = [namespace];
  const queryFn = ({ signal }) => ky
    .get(SETTINGS_ENTRIES_API, {
      searchParams: {
        query: `(scope=="${NAVIGATION_SETTINGS_SCOPE}" and key=="${NAVIGATION_SETTINGS_BROWSE_TAB_KEY}")`,
      },
      signal,
    })
    .json();

  const {
    data,
    isLoading,
    refetch,
  } = useQuery({
    queryKey,
    queryFn,
    ...options,
  });

  const navigationSettingsEntry = data?.items?.[0];

  return {
    navigationSettingsEntry,
    isBrowseTabEnabled: Boolean(navigationSettingsEntry?.value),
    isLoading,
    refetch,
  };
};
