/**
 * Folio Form - Controller component
 * 
 * Controlled field component wrapper
 */

import React from 'react';
import { FieldValues, FieldPath, ControllerProps } from '../types';
import { useController } from '../hooks/useController';

/**
 * Controller component for controlled fields
 */
export function Controller<T extends FieldValues = FieldValues>({
  name,
  control,
  rules,
  render,
}: ControllerProps<T>) {
  const { field, fieldState, formState } = useController({
    name,
    control,
    rules,
  });

  return render({ field, fieldState, formState });
}
