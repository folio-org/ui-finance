/**
 * Folio Form - useForm hook
 *
 * Main hook for form management with uncontrolled inputs
 */

import { startTransition, useRef, useCallback, useMemo, useEffect, useReducer } from 'react';
import { FormEngine } from '../core/FormEngine';

// Form state reducer
function formStateReducer(state, action) {
  switch (action.type) {
    case 'SET_FORM_STATE':
      return {
        ...state,
        ...action.payload,
        _version: state._version + 1,
      };
    case 'BATCH_UPDATE':
      return {
        ...state,
        ...action.payload,
        _version: state._version + 1,
        _isBatching: true,
      };
    case 'END_BATCH':
      return {
        ...state,
        _isBatching: false,
      };
    case 'RESET':
      return {
        ...action.payload,
        _version: 0,
        _isBatching: false,
      };
    default:
      return state;
  }
}

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

  // Form state with useReducer
  const [formState, dispatch] = useReducer(formStateReducer, () => ({
    ...engine.getFormState(),
    _version: 0,
    _isBatching: false,
  }));

  // Update form state when engine state changes - ULTRA OPTIMIZED
  useEffect(() => {
    let isUpdating = false;
    const batchTimeout = null;
    let lastUpdateTime = 0;

    const updateFormState = (eventType) => {
      // Skip change events for performance, but allow validation events
      if (eventType === 'change') {
        return;
      }

      const now = Date.now();

      // Throttle updates to 30fps for validation events
      if (now - lastUpdateTime < 33) {
        return;
      }

      if (isUpdating) return;
      isUpdating = true;
      lastUpdateTime = now;

      // Clear previous timeout
      if (batchTimeout) {
        clearTimeout(batchTimeout);
      }

      // Use React transitions for smooth updates
      startTransition(() => {
        const newState = engine.getFormState();

        // Immediate update for validation, submit, reset
        dispatch({ type: 'SET_FORM_STATE', payload: newState });

        isUpdating = false;
      });
    };

    const unsubscribe = engine.on('change', () => updateFormState('change'));
    const unsubscribeValidation = engine.on('validation', () => updateFormState('validation'));
    const unsubscribeSubmit = engine.on('submit', () => updateFormState('submit'));
    const unsubscribeReset = engine.on('reset', () => updateFormState('reset'));

    return () => {
      if (batchTimeout) {
        clearTimeout(batchTimeout);
      }
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
