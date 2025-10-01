/**
 * Folio Form - FormProvider component
 * 
 * Context provider for form state
 */

import React, { createContext, useContext } from 'react';
import { FieldValues, UseFormReturn } from '../types';

// Form context
const FormContext = createContext<UseFormReturn<FieldValues> | null>(null);

export interface FormProviderProps<T extends FieldValues = FieldValues> {
  children: React.ReactNode;
  form: UseFormReturn<T>;
}

/**
 * Form provider component
 */
export function FormProvider<T extends FieldValues = FieldValues>({
  children,
  form,
}: FormProviderProps<T>) {
  return (
    <FormContext.Provider value={form as UseFormReturn<FieldValues>}>
      {children}
    </FormContext.Provider>
  );
}

/**
 * Hook to use form context
 */
export function useFormContext<T extends FieldValues = FieldValues>(): UseFormReturn<T> {
  const context = useContext(FormContext);
  
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  
  return context as UseFormReturn<T>;
}
