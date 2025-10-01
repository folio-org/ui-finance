/**
 * Folio Form - Form component
 *
 * Main form wrapper component
 */

import { FormProvider } from './FormProvider';

/**
 * Form component
 */
export function Form({
  children,
  form,
  onSubmit,
  className,
  style,
  ...props
}) {
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
