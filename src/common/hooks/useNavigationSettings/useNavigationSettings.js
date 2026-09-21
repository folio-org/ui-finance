import {
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { CQLBuilder } from '@folio/stripes-acq-components';

import { SETTINGS_API } from '../../const';

export const BROWSE_TAB_ENABLED_SETTING_KEY = 'ENABLE_BROWSE_TAB';

export const useNavigationSettings = (options = {}) => {
  const ky = useOkapiKy();
  const queryClient = useQueryClient();
  const [namespace] = useNamespace({ key: 'navigation-settings' });

  const cqlBuilder = new CQLBuilder();
  const searchParams = {
    query: cqlBuilder.equal('key', BROWSE_TAB_ENABLED_SETTING_KEY).build(),
  };

  const queryKey = [namespace];
  const queryFn = ({ signal }) => ky.get(SETTINGS_API, { searchParams, signal }).json();

  const {
    data,
    isLoading,
    refetch,
  } = useQuery({
    queryKey,
    queryFn,
    retry: false,
    ...options,
  });

  const navigationSettingsEntry = data?.settings?.[0];

  const { mutateAsync: saveNavigationSettings } = useMutation({
    mutationFn: (enableBrowseTab) => {
      const value = String(enableBrowseTab);

      /*
       * On update, round-trip the fetched record (id, _version, metadata) rather than
       * rebuilding it, so RMB's optimistic locking on `_version` doesn't reject the PUT.
       */
      const request = navigationSettingsEntry
        ? ky.put(`${SETTINGS_API}/${navigationSettingsEntry.id}`, { json: { ...navigationSettingsEntry, value } })
        : ky.post(SETTINGS_API, { json: { key: BROWSE_TAB_ENABLED_SETTING_KEY, value } });

      return request.json();
    },
    onSuccess: () => queryClient.invalidateQueries(queryKey),
  });

  return {
    navigationSettingsEntry,
    isBrowseTabEnabled: navigationSettingsEntry?.value === 'true',
    isLoading,
    refetch,
    saveNavigationSettings,
  };
};
