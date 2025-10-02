/**
 * React hooks for FormEngine integration with optimizations
 */

import { useState, useEffect, useCallback, useMemo, useRef, useReducer } from 'react';
import { useFormEngine, useFormContext } from './FormContext';
import {
  FIELD_ACTIONS,
  FORM_ACTIONS,
  VALIDATION_MODES,
  DEFAULT_SUBSCRIPTION,
  DEFAULT_FORM_SUBSCRIPTION,
  EVENTS,
  FIELD_EVENT_PREFIXES,
  DEBOUNCE_DELAYS,
} from '../constants';

// Field state reducer
const fieldStateReducer = (state, action) => {
  switch (action.type) {
    case FIELD_ACTIONS.SET_VALUE:
      return { ...state, value: action.payload };
    case FIELD_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    case FIELD_ACTIONS.SET_TOUCHED:
      return { ...state, touched: action.payload };
    case FIELD_ACTIONS.SET_ACTIVE:
      return { ...state, active: action.payload };
    case FIELD_ACTIONS.UPDATE_MULTIPLE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

// Form state reducer
const formStateReducer = (state, action) => {
  switch (action.type) {
    case FORM_ACTIONS.UPDATE_FORM_STATE:
      return action.payload;
    default:
      return state;
  }
};

/**
 * Hook for field state and handlers with optimizations
 * @param {string} name - Field name
 * @param {Object} options - Field options
 */
export function useField(name, options = {}) {
  const engine = useFormEngine();
  const { defaultValidateOn } = useFormContext();

  const {
    validate,
    validateOn = defaultValidateOn,
    subscription = DEFAULT_SUBSCRIPTION,
    debounceDelay = DEBOUNCE_DELAYS.DEFAULT,
  } = options;

  // Ensure error subscription is enabled if validation is provided
  const effectiveSubscription = useMemo(() => ({
    ...subscription,
    error: subscription.error !== false || !!validate,
  }), [subscription, validate]);

  // Get initial state with useReducer
  const [fieldState, dispatch] = useReducer(fieldStateReducer, {
    value: engine.get(name),
    error: engine.getErrors()[name] || null,
    touched: engine.isTouched(name),
    active: engine.active === name,
  });

  // Debounce timer ref
  const debounceTimer = useRef(null);

  // Single effect for all subscriptions - optimized approach
  useEffect(() => {
    const unsubscribers = [];

    if (effectiveSubscription.value) {
      unsubscribers.push(
        engine.on(`${FIELD_EVENT_PREFIXES.CHANGE}${name}`, (newValue) => {
          dispatch({ type: FIELD_ACTIONS.SET_VALUE, payload: newValue });
        }),
      );
    }

    if (effectiveSubscription.error) {
      unsubscribers.push(
        engine.on(`${FIELD_EVENT_PREFIXES.ERROR}${name}`, (newError) => {
          dispatch({ type: FIELD_ACTIONS.SET_ERROR, payload: newError });
        }),
      );
    }

    if (effectiveSubscription.touched) {
      unsubscribers.push(
        engine.on(`${FIELD_EVENT_PREFIXES.TOUCH}${name}`, () => {
          dispatch({ type: FIELD_ACTIONS.SET_TOUCHED, payload: true });
        }),
      );
    }

    if (effectiveSubscription.active) {
      unsubscribers.push(
        engine.on(EVENTS.FOCUS, ({ path }) => {
          dispatch({ type: FIELD_ACTIONS.SET_ACTIVE, payload: path === name });
        }),
        engine.on(EVENTS.BLUR, () => {
          dispatch({ type: FIELD_ACTIONS.SET_ACTIVE, payload: false });
        }),
      );
    }

    // Subscribe to validation events for submit validation
    if (effectiveSubscription.error && validate) {
      unsubscribers.push(
        engine.on(EVENTS.VALIDATION, ({ errors }) => {
          if (errors && errors[name] !== undefined) {
            dispatch({ type: FIELD_ACTIONS.SET_ERROR, payload: errors[name] });
          }
        }),
      );

      // Also subscribe to submit events to catch validation errors
      unsubscribers.push(
        engine.on(EVENTS.SUBMIT, ({ errors }) => {
          if (errors && errors[name] !== undefined) {
            dispatch({ type: FIELD_ACTIONS.SET_ERROR, payload: errors[name] });
          }
        }),
      );
    }

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [engine, name, effectiveSubscription, validate]);

  // Debounced validation function
  const debouncedValidate = useCallback((fieldValue, allValues) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      if (validate) {
        const result = validate(fieldValue, allValues);

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
    }, debounceDelay);
  }, [validate, debounceDelay, engine, name]);

  // Field handlers
  const handlers = useMemo(() => ({
    onChange: (event) => {
      const newValue = event.target ? event.target.value : event;

      engine.set(name, newValue);

      // Register validator if provided
      if (validate && !engine.validators.has(name)) {
        engine.registerValidator(name, validate);
      }

      // Run validation on change
      if (validate && validateOn === VALIDATION_MODES.CHANGE) {
        if (debounceDelay > 0) {
          debouncedValidate(newValue, engine.getValues());
        } else {
          const result = validate(newValue, engine.getValues());

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
      }
    },
    onBlur: () => {
      engine.touch(name);
      engine.blur();

      // Clear debounce timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = null;
      }

      // Run validation on blur
      if (validate && validateOn === VALIDATION_MODES.BLUR) {
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
    },
    onFocus: () => {
      engine.focus(name);
    },
  }), [engine, name, validate, validateOn, debounceDelay, debouncedValidate]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  // Input props
  const input = useMemo(() => ({
    name,
    value: fieldState.value || '',
    ...handlers,
  }), [name, fieldState.value, handlers]);

  // Meta props
  const meta = useMemo(() => ({
    error: fieldState.error,
    touched: fieldState.touched,
    active: fieldState.active,
    dirty: fieldState.touched && fieldState.value !== engine.get(name),
  }), [fieldState, name, engine]);

  return {
    input,
    meta,
    value: fieldState.value,
    error: fieldState.error,
    touched: fieldState.touched,
    active: fieldState.active,
    ...handlers,
    debouncedValidate,
  };
}

/**
 * Hook for form state
 * @param {Object} subscription - What to subscribe to
 */
export function useFormState(subscription = DEFAULT_FORM_SUBSCRIPTION) {
  const engine = useFormEngine();

  const [formState, dispatch] = useReducer(formStateReducer, engine.getFormState());

  useEffect(() => {
    const unsubscribe = engine.on(EVENTS.CHANGE, () => {
      if (subscription.values || subscription.errors || subscription.touched ||
          subscription.active || subscription.submitting || subscription.valid) {
        dispatch({ type: FORM_ACTIONS.UPDATE_FORM_STATE, payload: engine.getFormState() });
      }
    });

    const unsubscribeError = engine.on(EVENTS.ERROR, () => {
      if (subscription.errors || subscription.valid) {
        dispatch({ type: FORM_ACTIONS.UPDATE_FORM_STATE, payload: engine.getFormState() });
      }
    });

    const unsubscribeTouch = engine.on(EVENTS.TOUCH, () => {
      if (subscription.touched) {
        dispatch({ type: FORM_ACTIONS.UPDATE_FORM_STATE, payload: engine.getFormState() });
      }
    });

    const unsubscribeFocus = engine.on(EVENTS.FOCUS, () => {
      if (subscription.active) {
        dispatch({ type: FORM_ACTIONS.UPDATE_FORM_STATE, payload: engine.getFormState() });
      }
    });

    const unsubscribeBlur = engine.on(EVENTS.BLUR, () => {
      if (subscription.active) {
        dispatch({ type: FORM_ACTIONS.UPDATE_FORM_STATE, payload: engine.getFormState() });
      }
    });

    const unsubscribeSubmit = engine.on(EVENTS.SUBMIT, () => {
      if (subscription.submitting || subscription.valid) {
        dispatch({ type: FORM_ACTIONS.UPDATE_FORM_STATE, payload: engine.getFormState() });
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

    const unsubscribers = pathArray.map(path => engine.on(`change:${path}`, () => {
      const newValues = pathArray.map(p => engine.get(p));

      if (selector) {
        setValues(selector(newValues));
      } else {
        setValues(Array.isArray(paths) ? newValues : newValues[0]);
      }
    }));

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

/**
 * Hook for debounced validation
 * @param {Function} validate - Validation function
 * @param {number} delay - Debounce delay in ms
 */
export function useDebouncedValidation(validate, delay = 300) {
  const [error, setError] = useState(null);
  const debounceTimer = useRef(null);
  const lastValue = useRef(null);

  const debouncedValidate = useCallback((value, allValues) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // If value hasn't changed, don't re-validate
    if (lastValue.current === value) {
      return;
    }

    lastValue.current = value;

    debounceTimer.current = setTimeout(async () => {
      try {
        const result = await validate(value, allValues);

        setError(result || null);
      } catch (err) {
        setError(err.message);
      }
    }, delay);
  }, [validate, delay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return { error, debouncedValidate };
}
