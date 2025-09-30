import React, { useEffect, useState, useMemo } from 'react';

import { useField } from '../hooks';

/**
 * FinalFormField
 *
 * - Primary usage: <Field name="user.name" component={TextField} label="Name" />
 *   The adapter will call useField(name) and pass `{ input, meta, ...rest }` to component.
 *
 * - Backward compatibility: if children is a function (render-prop), it will still be invoked.
 *
 * - Supports `validate` prop (sync or async). Adapter keeps a local error state so
 *   field-level validation can be optimistic and independent of engine-level validators.
 *
 * Performance note:
 * - Avoid passing inline objects/functions to `component` props to keep stable identity.
 * - Prefer `subscription` to limit which parts of the field cause re-renders.
 */
export default function FinalFormField({
  name,
  component: Component = null,
  children = null,
  validate = null,
  subscription = undefined,
  ...rest
}) {
  // subscribe to engine for this field
  const { input, meta, value, error } = useField(name, subscription);

  // local error state supports field-level validators (sync or async)
  const [localError, setLocalError] = useState(error);

  // keep localError in sync with engine errors if they change externally
  useEffect(() => {
    setLocalError(error);
  }, [error]);

  // run validate on mount and whenever value changes
  useEffect(() => {
    if (!validate) return;
    let active = true;

    try {
      const r = validate(value);

      if (r && typeof r.then === 'function') {
        // async validator
        r.then((res) => { if (active) setLocalError(res); }).catch(() => { });
      } else {
        setLocalError(r);
      }
    } catch (e) {
      setLocalError(undefined);
    }

    return () => { active = false; };
  }, [validate, value]);

  // wrapped input.onChange accepts DOM events or raw values (final-form compatibility)
  const wrappedInput = useMemo(() => ({
    ...input,
    onChange: (e) => {
      const next = (e && e.target !== undefined) ? e.target.value : e;

      input.onChange(next);
      // optimistic validation on change
      if (validate) {
        try {
          const r = validate(next);

          if (r && typeof r.then === 'function') {
            r.then((res) => setLocalError(res)).catch(() => { });
          } else {
            setLocalError(r);
          }
        } catch (err) { }
      }
    },
  }), [input, validate]);

  const wrappedMeta = useMemo(() => ({ ...meta, error: localError }), [meta, localError]);

  // If a component prop is supplied, render it with props style:
  // <Component input={input} meta={meta} {...rest} />
  if (Component) {
    // prefer stable prop shapes; avoid creating new objects inline in parent
    return React.createElement(Component, { input: wrappedInput, meta: wrappedMeta, ...rest });
  }

  // Backward compatibility: support render-prop children
  if (typeof children === 'function') {
    return children({ input: wrappedInput, meta: wrappedMeta });
  }

  // If neither component nor render-prop were provided, render null
  return null;
}
