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
  const queryFn = async ({ signal }) => {
    const { settings } = await ky.get(SETTINGS_API, { searchParams, signal }).json();
    const entry = settings?.[0];

    return {
      entry,
      navigationSettings: { enabled: entry?.value === 'true' },
    };
  };

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

  const navigationSettingsEntry = data?.entry;

  const { mutateAsync } = useMutation({
    mutationFn: ({ entry, enableBrowseTab }) => {
      const value = String(enableBrowseTab);

      /*
       * Round-trips the fetched record (id, _version, metadata) on update rather than
       * rebuilding it, so RMB's optimistic locking on `_version` doesn't reject the PUT.
       */
      const request = entry
        ? ky.put(`${SETTINGS_API}/${entry.id}`, { json: { ...entry, value } })
        : ky.post(SETTINGS_API, { json: { key: BROWSE_TAB_ENABLED_SETTING_KEY, value } });

      return request.json();
    },
    onSuccess: () => queryClient.invalidateQueries(queryKey),
  });

  const saveNavigationSettings = (enableBrowseTab) => mutateAsync({
    entry: navigationSettingsEntry,
    enableBrowseTab,
  });

  return {
    navigationSettings: data?.navigationSettings,
    isLoading,
    refetch,
    saveNavigationSettings,
  };
};
