/**
 * Folio Form - Controller component
 *
 * Controlled field component wrapper
 */

import { useController } from '../hooks/useController';

/**
 * Controller component for controlled fields
 */
export function Controller({
  name,
  control,
  rules,
  render,
}) {
  const { field, fieldState, formState } = useController({
    name,
    control,
    rules,
  });

  return render({ field, fieldState, formState });
}
