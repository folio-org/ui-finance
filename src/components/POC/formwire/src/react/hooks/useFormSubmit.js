/**
 * useFormSubmit - Hook for form submission
 */

import { useCallback } from 'react';
import { useFormEngine } from '../FormContext';

export function useFormSubmit(onSubmit) {
  const engine = useFormEngine();

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

  return {
    handleSubmit,
    submitting: engine.submitting,
  };
}
