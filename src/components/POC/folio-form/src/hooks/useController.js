/**
 * Folio Form - useController hook
 *
 * Hook for controlled field components
 */

import { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { useFormContext } from '../components/FormProvider';
import { getByPath } from '../utils';

/**
 * Controller hook for controlled field components
 */
export function useController({
  name,
  rules,
  defaultValue,
}) {
  const { register, formState, setValue, getValue } = useFormContext();
  const [fieldState, setFieldState] = useState({
    error: undefined,
    isTouched: false,
    isDirty: false,
  });

  const fieldRef = useRef(null);

  // Register field with form engine
  const { onChange, onBlur } = register(name, rules);

  // Update field state only for errors (performance optimized)
  const fieldError = getByPath(formState.errors, name);

  useEffect(() => {
    setFieldState(prev => ({
      ...prev,
      error: fieldError,
    }));
  }, [fieldError]);

  const handleChange = useCallback((event) => {
    // Handle both direct values and events
    const value = event?.target?.value ?? event;

    // Direct update without transitions for maximum performance
    setValue(name, value);

    // Create a synthetic event for the original onChange
    const syntheticEvent = {
      target: { value },
      currentTarget: { value },
    };

    onChange(syntheticEvent);
  }, [name, setValue, onChange]);

  const handleBlur = useCallback((event) => {
    onBlur(event);
  }, [onBlur]);

  const currentValue = getValue(name);

  const field = useMemo(() => ({
    ref: fieldRef,
    name,
    value: currentValue ?? defaultValue,
    onChange: handleChange,
    onBlur: handleBlur,
  }), [name, defaultValue, currentValue, handleChange, handleBlur]);

  return {
    field,
    fieldState,
    formState,
  };
}
