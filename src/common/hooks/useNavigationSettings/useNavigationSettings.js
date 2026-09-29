import {
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { CQLBuilder } from '@folio/stripes-acq-components';

import { BROWSE_TAB_ENABLED_SETTING_KEY, SETTINGS_API } from '../../const';

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

    return { enabled: entry?.value === 'true' };
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

  const { mutateAsync: saveNavigationSettings } = useMutation({
    mutationFn: async (enableBrowseTab) => {
      const value = String(enableBrowseTab);

      /*
       * Reads the current entry right before writing (rather than reusing the display
       * query's cached data) so the PUT always carries a fresh `_version` for RMB's
       * optimistic locking, and so mutationFn depends only on its own argument.
       */
      const { settings } = await ky.get(SETTINGS_API, { searchParams }).json();
      const entry = settings?.[0];

      const request = entry
        ? ky.put(`${SETTINGS_API}/${entry.id}`, { json: { ...entry, value } })
        : ky.post(SETTINGS_API, { json: { key: BROWSE_TAB_ENABLED_SETTING_KEY, value } });

      return request.json();
    },
    onSuccess: () => queryClient.invalidateQueries(queryKey),
  });

  return {
    navigationSettings: data,
    isLoading,
    refetch,
    saveNavigationSettings,
  };
};
