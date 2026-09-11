import { v4 as uuidv4 } from 'uuid';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';

import { NAVIGATION_SETTINGS_API } from '../../const';

export const useNavigationSettings = (options = {}) => {
  const ky = useOkapiKy();
  const queryClient = useQueryClient();
  const [namespace] = useNamespace({ key: 'navigation-settings' });

  const queryKey = [namespace];
  const queryFn = ({ signal }) => ky.get(NAVIGATION_SETTINGS_API, { signal }).json();

  const {
    data: navigationSettingsEntry,
    isLoading,
    refetch,
  } = useQuery({
    queryKey,
    queryFn,
    retry: false,
    ...options,
  });

  const { mutateAsync: saveNavigationSettings } = useMutation({
    mutationFn: (enableBrowseTab) => {
      const payload = {
        id: navigationSettingsEntry?.id || uuidv4(),
        enableBrowseTab,
      };

      const request = navigationSettingsEntry
        ? ky.put(`${NAVIGATION_SETTINGS_API}/${payload.id}`, { json: payload })
        : ky.post(NAVIGATION_SETTINGS_API, { json: payload });

      return request.json();
    },
    onSuccess: () => queryClient.invalidateQueries(queryKey),
  });

  return {
    navigationSettingsEntry,
    isBrowseTabEnabled: Boolean(navigationSettingsEntry?.enableBrowseTab),
    isLoading,
    refetch,
    saveNavigationSettings,
  };
};
