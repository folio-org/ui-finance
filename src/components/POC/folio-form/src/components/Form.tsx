/**
 * Folio Form - Form component
 * 
 * Main form wrapper component
 */

import React from 'react';
import { FieldValues, UseFormReturn } from '../types';
import { FormProvider } from './FormProvider';

export interface FormProps<T extends FieldValues = FieldValues> {
  children: React.ReactNode;
  form: UseFormReturn<T>;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Form component
 */
export function Form<T extends FieldValues = FieldValues>({
  children,
  form,
  onSubmit,
  className,
  style,
  ...props
}: FormProps<T>) {
  return (
    <FormProvider form={form}>
      <form
        onSubmit={onSubmit}
        className={className}
        style={style}
        {...props}
      >
        {children}
      </form>
    </FormProvider>
  );
}
