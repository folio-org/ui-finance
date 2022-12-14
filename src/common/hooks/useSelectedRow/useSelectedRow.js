import { useCallback, useMemo } from 'react';
import { matchPath, useLocation } from 'react-router-dom';

export const useSelectedRow = (path) => {
  const location = useLocation();

  const urlParams = useMemo(() => (
    matchPath(location.pathname, { path })
  ), [location.pathname, path]);

  const isRowSelected = useCallback(({ item }) => {
    return urlParams && (urlParams.params.id === item.id);
  }, [urlParams]);

  return isRowSelected;
};
