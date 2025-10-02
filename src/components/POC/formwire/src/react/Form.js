/**
 * Form component - Main form wrapper
 */

import React, { useMemo, useCallback } from 'react';
import FormEngine from '../core/FormEngine';
import { FormProvider } from './FormContext';

export default function Form({
  children,
  onSubmit,
  initialValues = {},
  defaultValidateOn = 'blur',
  engine: providedEngine,
  ...rest
}) {
  // Create form engine instance or use provided one
  const engine = useMemo(() => {
    if (providedEngine) {
      return providedEngine;
    }

    const newEngine = new FormEngine();

    newEngine.init(initialValues, { validateOnBlur: defaultValidateOn === 'blur' });

    return newEngine;
  }, [providedEngine, initialValues, defaultValidateOn]);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault?.();

    if (onSubmit) {
      const result = await engine.submit(onSubmit);

      if (!result.success) {
        // Form submission failed - errors are handled by FormEngine
        // Could emit custom event or call error callback here
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
