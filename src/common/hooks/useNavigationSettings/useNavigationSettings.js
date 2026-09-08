import { v4 as uuidv4 } from 'uuid';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';

import { SETTINGS_API } from '../../const';

export const ENABLE_BROWSE_TAB_SETTING_KEY = 'ENABLE_BROWSE_TAB';

export const useNavigationSettings = (options = {}) => {
  const ky = useOkapiKy();
  const queryClient = useQueryClient();
  const [namespace] = useNamespace({ key: 'navigation-settings' });

  const queryKey = [namespace];
  const queryFn = ({ signal }) => ky
    .get(SETTINGS_API, {
      searchParams: { query: `key=="${ENABLE_BROWSE_TAB_SETTING_KEY}"` },
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
    retry: false,
    ...options,
  });

  const navigationSettingsEntry = data?.settings?.[0];

  const { mutateAsync: saveNavigationSettings } = useMutation({
    mutationFn: (enableBrowseTab) => {
      const payload = {
        id: navigationSettingsEntry?.id || uuidv4(),
        key: ENABLE_BROWSE_TAB_SETTING_KEY,
        value: String(enableBrowseTab),
        _version: navigationSettingsEntry?._version,
      };

      const request = navigationSettingsEntry
        ? ky.put(`${SETTINGS_API}/${payload.id}`, { json: payload })
        : ky.post(SETTINGS_API, { json: payload });

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
