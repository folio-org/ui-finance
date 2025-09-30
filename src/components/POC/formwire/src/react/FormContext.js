import React, { createContext, useContext } from 'react';

/**
 * FormProvider: React context provider that exposes FormEngine instance.
 */
export const FormContext = createContext(null);

export function FormProvider({ engine, children }) {
  return React.createElement(FormContext.Provider, { value: engine }, children);
}

export function useFormEngine() {
  const engine = useContext(FormContext);

  if (!engine) throw new Error('useFormEngine must be used inside FormProvider');

  return engine;
}
