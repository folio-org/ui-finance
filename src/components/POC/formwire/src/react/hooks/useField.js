/**
 * useField - Hook for field state management
 */

import { useEffect, useCallback, useMemo, useReducer } from 'react';
import { useFormEngine } from '../FormContext';
import {
  FIELD_ACTIONS,
  VALIDATION_MODES,
  DEFAULT_SUBSCRIPTION,
  FIELD_EVENT_PREFIXES,
  DEBOUNCE_DELAYS,
  EVENTS,
} from '../../constants';
import { validateField } from '../../utils/validation';

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

export function useField(name, options = {}) {
  const engine = useFormEngine();
  const {
    validate,
    validateOn = VALIDATION_MODES.BLUR,
    debounceDelay = DEBOUNCE_DELAYS.DEFAULT,
    subscription = DEFAULT_SUBSCRIPTION,
  } = options;

  // Get initial state with useReducer
  const [fieldState, dispatch] = useReducer(fieldStateReducer, {
    value: engine.get(name),
    error: engine.getErrors()[name],
    touched: engine.isTouched(name),
    active: engine.active === name,
  });

  // Debounced validation function
  const debouncedValidate = useCallback(
    (value, allValues) => {
      if (!validate) return;

      const validator = engine.validationService.createDebouncedValidator(validate, debounceDelay);

      validator(value, allValues, (error) => {
        if (error) {
          engine.setError(name, error);
        } else {
          engine.clearError(name);
        }
      });
    },
    [validate, debounceDelay, engine, name],
  );

  // Set up subscriptions
  useEffect(() => {
    const unsubscribers = [];

    if (subscription.value) {
      unsubscribers.push(
        engine.on(`${FIELD_EVENT_PREFIXES.CHANGE}${name}`, (newValue) => {
          dispatch({ type: FIELD_ACTIONS.SET_VALUE, payload: newValue });
        }),
      );
    }

    if (subscription.error) {
      unsubscribers.push(
        engine.on(`${FIELD_EVENT_PREFIXES.ERROR}${name}`, (newError) => {
          dispatch({ type: FIELD_ACTIONS.SET_ERROR, payload: newError });
        }),
      );
    }

    if (subscription.touched) {
      unsubscribers.push(
        engine.on(`${FIELD_EVENT_PREFIXES.TOUCH}${name}`, () => {
          dispatch({ type: FIELD_ACTIONS.SET_TOUCHED, payload: true });
        }),
      );
    }

    if (subscription.active) {
      unsubscribers.push(
        engine.on(EVENTS.FOCUS, ({ path }) => {
          dispatch({ type: FIELD_ACTIONS.SET_ACTIVE, payload: path === name });
        }),
      );
      unsubscribers.push(
        engine.on(EVENTS.BLUR, () => {
          dispatch({ type: FIELD_ACTIONS.SET_ACTIVE, payload: false });
        }),
      );
    }

    // Listen for validation errors
    if (validate) {
      unsubscribers.push(
        engine.on(EVENTS.VALIDATION, ({ errors }) => {
          if (errors[name]) {
            dispatch({ type: FIELD_ACTIONS.SET_ERROR, payload: errors[name] });
          }
        }),
      );
      unsubscribers.push(
        engine.on(EVENTS.SUBMIT, ({ errors }) => {
          if (errors && errors[name]) {
            dispatch({ type: FIELD_ACTIONS.SET_ERROR, payload: errors[name] });
          }
        }),
      );
    }

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [engine, name, subscription, validate]);

  // Field handlers
  const handlers = useMemo(() => ({
    onChange: (event) => {
      const newValue = event.target ? event.target.value : event;

      engine.set(name, newValue);

      // Register validator if provided
      if (validate && !engine.hasValidator(name)) {
        engine.registerValidator(name, validate);
      }

      // Run validation on change
      if (validate && validateOn === VALIDATION_MODES.CHANGE) {
        if (debounceDelay > 0) {
          debouncedValidate(newValue, engine.getValues());
        } else {
          validateField(validate, newValue, engine.getValues(), engine, name);
        }
      }
    },
    onBlur: () => {
      engine.touch(name);
      engine.blur();

      // Run validation on blur
      if (validate && validateOn === VALIDATION_MODES.BLUR) {
        const fieldValue = engine.get(name);

        validateField(validate, fieldValue, engine.getValues(), engine, name);
      }
    },
    onFocus: () => {
      engine.focus(name);
    },
  }), [engine, name, validate, validateOn, debounceDelay, debouncedValidate]);

  // Input props
  const input = useMemo(() => ({
    name,
    value: fieldState.value || '',
    onChange: handlers.onChange,
    onBlur: handlers.onBlur,
    onFocus: handlers.onFocus,
  }), [name, fieldState.value, handlers]);

  // Meta props
  const meta = useMemo(() => ({
    error: fieldState.error,
    touched: fieldState.touched,
    active: fieldState.active,
  }), [fieldState.error, fieldState.touched, fieldState.active]);

  return {
    value: input.value,
    onChange: input.onChange,
    onBlur: input.onBlur,
    onFocus: input.onFocus,
    error: meta.error,
    touched: meta.touched,
    active: meta.active,
    input,
    meta,
  };
}
