import { useNavigationSettings } from '../useNavigationSettings';

export const useBrowseTabEnabled = () => {
  const { navigationSettings, isLoading } = useNavigationSettings();

  return {
    isBrowseTabEnabled: Boolean(navigationSettings?.enabled),
    isLoading,
  };
};
