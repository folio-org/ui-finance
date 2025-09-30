import { useState, useEffect, startTransition, useContext } from 'react';

import { shallowEqual } from '../core/utils';
import { FormContext, useFormEngine } from './FormContext';

/**
 * useField: subscribe to a single field path with a subscription mask.
 * Returns { input, meta, value, error, touched, active }.
 */
export function useField(name, subscription = { value: true, error: true, touched: true, active: true }) {
  const engine = useFormEngine();

  const [value, setValue] = useState(() => engine.get(name));
  const [error, setError] = useState(() => engine.errors[name] || null);
  const [touched, setTouched] = useState(() => engine.isTouched(name));
  const [active, setActive] = useState(() => engine.active === name);

  useEffect(() => {
    const unsub = [];

    if (subscription.value) {
      unsub.push(engine.subscribe(name, (v) => startTransition(() => setValue(v))));
    }
    if (subscription.error) {
      unsub.push(engine.subscribeMeta(name, (err) => startTransition(() => setError(err))));
    }
    if (subscription.touched) {
      unsub.push(engine.emitter.on(`touch:${name}`, () => startTransition(() => setTouched(true))));
    }
    if (subscription.active) {
      unsub.push(engine.emitter.on('focus', (path) => startTransition(() => setActive(path === name))));
      unsub.push(engine.emitter.on('blur', () => startTransition(() => setActive(false))));
    }

    return () => unsub.forEach(u => u && u());
  }, [engine, name, JSON.stringify(subscription)]);

  const input = {
    name,
    value,
    onChange: (v) => startTransition(() => engine.set(name, v)),
    onBlur: () => {
      startTransition(() => {
        engine.touch(name);
        engine.blur();
      });
    },
    onFocus: () => startTransition(() => engine.focus(name)),
  };

  const meta = { error, touched, active };

  return { input, meta, value, error, touched, active };
}

/**
 * useFormState: subscribe to global changes and apply optional selector.
 */
export function useFormState(selector) {
  const engine = useFormEngine();
  const [selValue, setSelValue] = useState(() => (selector ? selector(engine.getValues()) : engine.getValues()));

  useEffect(() => {
    const unsub = engine.subscribe('*', (_evt, _p, values) => {
      const next = selector ? selector(values) : values;

      startTransition(() => {
        if (typeof next === 'object') {
          if (!shallowEqual(next, selValue)) setSelValue(next);
        } else {
          setSelValue(next);
        }
      });
    });

    return unsub;
  }, [engine, selector]);

  return selValue;
}

/**
 * useWatch(pathOrSelector, cb)
 *
 * Subscribe to a specific path (string) or a selector function.
 * Runs the callback on change, but does NOT cause re-render.
 */
export function useWatch(pathOrSelector, cb, opts = {}) {
  const { engine } = useContext(FormContext);

  useEffect(() => {
    if (!engine) return;
    if (typeof pathOrSelector === 'string') {
      return engine.subscribe(pathOrSelector, (val) => cb(val));
    } else if (typeof pathOrSelector === 'function') {
      return engine.subscribeSelector(pathOrSelector, (val) => cb(val), opts);
    }
  }, [engine, pathOrSelector, cb]);
}

/**
 * useWatchState(selector)
 *
 * Returns the current derived value of the form and re-renders only when it changes.
 */
export function useWatchState(selector, { deep = true } = {}) {
  const { engine } = useContext(FormContext);
  const [value, setValue] = useState(() => selector(engine.getValues()));

  useEffect(() => {
    if (!engine) return;

    return engine.subscribeSelector(selector, setValue, { deep });
  }, [engine, selector, deep]);

  return value;
}
