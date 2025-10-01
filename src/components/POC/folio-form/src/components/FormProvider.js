/**
 * Folio Form - FormProvider component
 *
 * Context provider for form state
 */

import { createContext, useContext } from 'react';

// Form context
const FormContext = createContext(null);

/**
 * Form provider component
 */
export function FormProvider({
  children,
  form,
}) {
  return (
    <FormContext.Provider value={form}>
      {children}
    </FormContext.Provider>
  );
}

/**
 * Hook to use form context
 */
export function useFormContext() {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }

  return context;
}
