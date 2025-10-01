/**
 * Folio Form - useWatch hook
 *
 * Hook for watching field values with minimal re-renders
 */

import { useEffect, useState } from 'react';
import { useFormContext } from '../components/FormProvider';

/**
 * Watch field values
 */
export function useWatch(name) {
  const { watch, formState } = useFormContext();
  const [watchedValue, setWatchedValue] = useState(() => watch(name));

  useEffect(() => {
    const currentValue = watch(name);

    setWatchedValue(currentValue);
  }, [watch, name, formState.values]);

  return watchedValue;
}
