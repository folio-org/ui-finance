/**
 * Folio Form - useController hook
 *
 * Hook for controlled field components
 */

import { useCallback, useMemo, useEffect, useState, useRef } from 'react';
import { useFormContext } from '../components/FormProvider';

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
    error: formState.errors[name],
    isTouched: formState.touchedFields[name] || false,
    isDirty: formState.dirtyFields[name] || false,
  });

  const fieldRef = useRef(null);

  // Register field with form engine
  const { onChange, onBlur } = register(name, rules);

  // Update field state when form state changes
  const fieldError = formState.errors[name];
  const isTouched = formState.touchedFields[name] || false;
  const isDirty = formState.dirtyFields[name] || false;

  useEffect(() => {
    setFieldState({
      error: fieldError,
      isTouched,
      isDirty,
    });
  }, [fieldError, isTouched, isDirty]);

  const handleChange = useCallback((event) => {
    const value = event?.target?.value ?? event;

    setValue(name, value);
    onChange(event);
  }, [name, setValue, onChange]);

  const handleBlur = useCallback((event) => {
    onBlur(event);
  }, [onBlur]);

  const field = useMemo(() => ({
    ref: fieldRef,
    name,
    value: getValue(name) ?? defaultValue,
    onChange: handleChange,
    onBlur: handleBlur,
  }), [name, defaultValue, getValue, handleChange, handleBlur]);

  return {
    field,
    fieldState,
    formState,
  };
}
