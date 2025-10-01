/**
 * Form component - Main form wrapper
 */

import React, { useMemo, useCallback } from 'react';
import FormEngine from '../core/FormEngine.js';
import { FormProvider } from './FormContext.js';

export default function Form({
  children,
  onSubmit,
  initialValues = {},
  defaultValidateOn = 'blur',
  ...rest
}) {
  // Create form engine instance
  const engine = useMemo(() => new FormEngine(initialValues), [initialValues]);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (onSubmit) {
      const result = await engine.submit(onSubmit);

      if (!result.success) {
        console.warn('Form submission failed:', result.error || result.errors);
      }
    }
  }, [engine, onSubmit]);

  return (
    <FormProvider
      engine={engine}
      defaultValidateOn={defaultValidateOn}
    >
      <form
        {...rest}
        onSubmit={handleSubmit}
      >
        {children}
      </form>
    </FormProvider>
  );
}
