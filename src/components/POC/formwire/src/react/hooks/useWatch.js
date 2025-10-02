/**
 * useWatch - Hook for watching specific field values
 */

import { useState, useEffect } from 'react';
import { useFormEngine } from '../FormContext';
import { FIELD_EVENT_PREFIXES } from '../../constants';

export function useWatch(name, selector = null) {
  const engine = useFormEngine();
  const [value, setValue] = useState(() => {
    const fieldValue = engine.get(name);

    return selector ? selector(fieldValue) : fieldValue;
  });

  useEffect(() => {
    const unsubscribe = engine.on(`${FIELD_EVENT_PREFIXES.CHANGE}${name}`, (newValue) => {
      setValue(selector ? selector(newValue) : newValue);
    });

    return unsubscribe;
  }, [engine, name, selector]);

  return value;
}
