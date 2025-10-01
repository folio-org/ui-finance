/**
 * Folio Form - useForm hook
 *
 * Main hook for form management with uncontrolled inputs
 */

import { useRef, useCallback, useMemo, useEffect, useState } from 'react';
import { FormEngine } from '../core/FormEngine';

/**
 * Main form hook
 */
export function useForm(options = {}) {
  // Create form engine instance
  const engineRef = useRef(null);

  if (!engineRef.current) {
    engineRef.current = new FormEngine(options.defaultValues, options);
  }

  const engine = engineRef.current;

  // Form state
  const [formState, setFormState] = useState(() => engine.getFormState());

  // Update form state when engine state changes - OPTIMIZED
  useEffect(() => {
    let isUpdating = false;

    const updateFormState = () => {
      if (isUpdating) return;
      isUpdating = true;

      // Batch state updates
      requestAnimationFrame(() => {
        setFormState(engine.getFormState());
        isUpdating = false;
      });
    };

    const unsubscribe = engine.on('change', updateFormState);
    const unsubscribeValidation = engine.on('validation', updateFormState);
    const unsubscribeSubmit = engine.on('submit', updateFormState);
    const unsubscribeReset = engine.on('reset', updateFormState);

    return () => {
      unsubscribe();
      unsubscribeValidation();
      unsubscribeSubmit();
      unsubscribeReset();
    };
  }, [engine]);

  // ============================================================================
  // FIELD METHODS
  // ============================================================================

  const register = useCallback((name, rules) => {
    return engine.register(name, rules);
  }, [engine]);

  const unregister = useCallback((name) => {
    engine.unregister(name);
  }, [engine]);

  const setValue = useCallback((name, value, setOptions = {}) => {
    engine.setValue(name, value, setOptions);
  }, [engine]);

  const getValue = useCallback((name) => {
    return engine.getValue(name);
  }, [engine]);

  const getValues = useCallback(() => {
    return engine.getValues();
  }, [engine]);

  const setError = useCallback((name, error) => {
    engine.setError(name, error);
  }, [engine]);

  const clearErrors = useCallback((name) => {
    engine.clearErrors(name);
  }, [engine]);

  const trigger = useCallback(async (name) => {
    return engine.trigger(name);
  }, [engine]);

  const reset = useCallback((values) => {
    engine.reset(values);
  }, [engine]);

  const handleSubmit = useCallback((onSubmit) => {
    return (e) => {
      if (e) {
        e.preventDefault();
      }

      return engine.handleSubmit(onSubmit);
    };
  }, [engine]);

  const watch = useCallback((name) => {
    return engine.watch(name);
  }, [engine]);

  // ============================================================================
  // FIELD ARRAY METHODS (simplified for now)
  // ============================================================================

  const append = useCallback((_value) => {
    // TODO: Implement field array append
    // eslint-disable-next-line no-console
    console.warn('Field array methods not implemented yet');
  }, []);

  const prepend = useCallback((_value) => {
    // TODO: Implement field array prepend
    // eslint-disable-next-line no-console
    console.warn('Field array methods not implemented yet');
  }, []);

  const insert = useCallback((_index, _value) => {
    // TODO: Implement field array insert
    // eslint-disable-next-line no-console
    console.warn('Field array methods not implemented yet');
  }, []);

  const swap = useCallback((_indexA, _indexB) => {
    // TODO: Implement field array swap
    // eslint-disable-next-line no-console
    console.warn('Field array methods not implemented yet');
  }, []);

  const move = useCallback((_from, _to) => {
    // TODO: Implement field array move
    // eslint-disable-next-line no-console
    console.warn('Field array methods not implemented yet');
  }, []);

  const update = useCallback((_index, _value) => {
    // TODO: Implement field array update
    // eslint-disable-next-line no-console
    console.warn('Field array methods not implemented yet');
  }, []);

  const remove = useCallback((_index) => {
    // TODO: Implement field array remove
    // eslint-disable-next-line no-console
    console.warn('Field array methods not implemented yet');
  }, []);

  const replace = useCallback((_values) => {
    // TODO: Implement field array replace
    // eslint-disable-next-line no-console
    console.warn('Field array methods not implemented yet');
  }, []);

  // ============================================================================
  // RETURN VALUE
  // ============================================================================

  return useMemo(() => ({
    // Field methods
    register,
    unregister,
    setValue,
    getValue,
    getValues,
    setError,
    clearErrors,
    trigger,
    reset,
    handleSubmit,

    // Form state
    formState,
    watch,

    // Field array methods
    append,
    prepend,
    insert,
    swap,
    move,
    update,
    remove,
    replace,
  }), [
    register,
    unregister,
    setValue,
    getValue,
    getValues,
    setError,
    clearErrors,
    trigger,
    reset,
    handleSubmit,
    formState,
    watch,
    append,
    prepend,
    insert,
    swap,
    move,
    update,
    remove,
    replace,
  ]);
}
