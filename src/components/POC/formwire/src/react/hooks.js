/**
 * React hooks for FormEngine integration
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useFormEngine, useFormContext } from './FormContext.js';

/**
 * Hook for field state and handlers
 * @param {string} name - Field name
 * @param {Object} options - Field options
 */
export function useField(name, options = {}) {
  const engine = useFormEngine();
  const { defaultValidateOn } = useFormContext();
  
  const {
    validate,
    validateOn = defaultValidateOn,
    subscription = { value: true, error: true, touched: true, active: true }
  } = options;

  // Create context for automatic cleanup
  const fieldContext = useMemo(() => ({ name, subscription }), [name, subscription]);

  // Get initial state
  const [value, setValue] = useState(() => engine.get(name));
  const [error, setError] = useState(() => engine.getErrors()[name] || null);
  const [touched, setTouched] = useState(() => engine.isTouched(name));
  const [active, setActive] = useState(() => engine.active === name);

  // Subscribe to field changes with optimized event system
  useEffect(() => {
    if (!subscription.value) return;
    
    const unsubscribe = engine.on(`change:${name}`, (newValue) => {
      setValue(newValue);
    }, fieldContext);
    
    return unsubscribe;
  }, [engine, name, subscription.value, fieldContext]);

  // Subscribe to field errors with optimized event system
  useEffect(() => {
    if (!subscription.error) return;
    
    const unsubscribe = engine.on(`error:${name}`, (newError) => {
      setError(newError);
    }, fieldContext);
    
    return unsubscribe;
  }, [engine, name, subscription.error, fieldContext]);

  // Subscribe to field touched state with optimized event system
  useEffect(() => {
    if (!subscription.touched) return;
    
    const unsubscribe = engine.on(`touch:${name}`, () => {
      setTouched(true);
    }, fieldContext);
    
    return unsubscribe;
  }, [engine, name, subscription.touched, fieldContext]);

  // Subscribe to field active state with optimized event system
  useEffect(() => {
    if (!subscription.active) return;
    
    const unsubscribe = engine.on('focus', ({ path }) => {
      setActive(path === name);
    }, fieldContext);
    
    const unsubscribeBlur = engine.on('blur', () => {
      setActive(false);
    }, fieldContext);
    
    return () => {
      unsubscribe();
      unsubscribeBlur();
    };
  }, [engine, name, subscription.active, fieldContext]);

  // Field handlers
  const onChange = useCallback((event) => {
    const newValue = event.target ? event.target.value : event;
    engine.set(name, newValue);
  }, [engine, name]);

  const onBlur = useCallback(() => {
    engine.touch(name);
    engine.blur();
    
    // Run validation on blur
    if (validate && validateOn === 'blur') {
      const fieldValue = engine.get(name);
      const result = validate(fieldValue, engine.getValues());
      
      if (result && typeof result.then === 'function') {
        result.then((error) => {
          if (error) {
            engine.setError(name, error);
          } else {
            engine.clearError(name);
          }
        }).catch((err) => {
          engine.setError(name, err.message);
        });
      } else if (result) {
        engine.setError(name, result);
      } else {
        engine.clearError(name);
      }
    }
  }, [engine, name, validate, validateOn]);

  const onFocus = useCallback(() => {
    engine.focus(name);
  }, [engine, name]);

  // Input props
  const input = useMemo(() => ({
    name,
    value: value || '',
    onChange,
    onBlur,
    onFocus,
  }), [name, value, onChange, onBlur, onFocus]);

  // Meta props
  const meta = useMemo(() => ({
    error,
    touched,
    active,
    dirty: touched && value !== engine.get(name),
  }), [error, touched, active, name, value, engine]);

  return { input, meta, value, error, touched, active };
}

/**
 * Hook for form state
 * @param {Object} subscription - What to subscribe to
 */
export function useFormState(subscription = { values: true, errors: true, touched: true, active: true, submitting: true, valid: true }) {
  const engine = useFormEngine();
  
  const [formState, setFormState] = useState(() => engine.getFormState());

  useEffect(() => {
    const unsubscribe = engine.on('change', () => {
      if (subscription.values || subscription.errors || subscription.touched || subscription.active || subscription.submitting || subscription.valid) {
        setFormState(engine.getFormState());
      }
    });

    const unsubscribeError = engine.on('error', () => {
      if (subscription.errors || subscription.valid) {
        setFormState(engine.getFormState());
      }
    });

    const unsubscribeTouch = engine.on('touch', () => {
      if (subscription.touched) {
        setFormState(engine.getFormState());
      }
    });

    const unsubscribeFocus = engine.on('focus', () => {
      if (subscription.active) {
        setFormState(engine.getFormState());
      }
    });

    const unsubscribeBlur = engine.on('blur', () => {
      if (subscription.active) {
        setFormState(engine.getFormState());
      }
    });

    const unsubscribeSubmit = engine.on('submit', () => {
      if (subscription.submitting || subscription.valid) {
        setFormState(engine.getFormState());
      }
    });

    return () => {
      unsubscribe();
      unsubscribeError();
      unsubscribeTouch();
      unsubscribeFocus();
      unsubscribeBlur();
      unsubscribeSubmit();
    };
  }, [engine, subscription]);

  return formState;
}

/**
 * Hook for watching specific values
 * @param {string|Array} paths - Path(s) to watch
 * @param {Function} selector - Optional selector function
 */
export function useWatch(paths, selector) {
  const engine = useFormEngine();
  
  const [values, setValues] = useState(() => {
    if (Array.isArray(paths)) {
      return paths.map(path => engine.get(path));
    }
    return engine.get(paths);
  });

  useEffect(() => {
    const pathArray = Array.isArray(paths) ? paths : [paths];
    
    const unsubscribers = pathArray.map(path => 
      engine.on(`change:${path}`, () => {
        const newValues = pathArray.map(p => engine.get(p));
        if (selector) {
          setValues(selector(newValues));
        } else {
          setValues(Array.isArray(paths) ? newValues : newValues[0]);
        }
      })
    );

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [engine, paths, selector]);

  return values;
}

/**
 * Hook for form submission
 */
export function useFormSubmit() {
  const engine = useFormEngine();
  
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  useEffect(() => {
    const unsubscribe = engine.on('submit', ({ submitting: isSubmitting, success, error, values }) => {
      setSubmitting(isSubmitting);
      setSubmitResult({ success, error, values });
    });

    return unsubscribe;
  }, [engine]);

  const submit = useCallback(async (onSubmit) => {
    const result = await engine.submit(onSubmit);
    return result;
  }, [engine]);

  return { submit, submitting, submitResult };
}
