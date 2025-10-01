/**
 * Field component - Generic field wrapper
 */

import React from 'react';
import { useField } from './hooks.js';

export default function Field({
  name,
  component: Component,
  children,
  validate,
  validateOn,
  ...rest
}) {
  const { input, meta, value, error } = useField(name, {
    validate,
    validateOn,
  });

  // Render with component
  if (Component) {
    return (
      <Component
        {...input}
        {...rest}
        error={error}
        meta={meta}
      />
    );
  }

  // Render with children function
  if (typeof children === 'function') {
    return children({ input, meta, value, error });
  }

  // Default input
  return (
    <input
      {...input}
      {...rest}
    />
  );
}
