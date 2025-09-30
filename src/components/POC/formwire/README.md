High-performance form engine using a lightweight EventEmitter and path-based subscriptions.  
Provides React hooks and adapters that emulate `react-final-form`'s `{ input, meta }` API so you can reuse existing UI components (e.g. `stripes-components`) without modification.

## Features

- Minimal renders via field-level subscriptions
- ESM source, ready to publish
- React adapters: `FormProvider`, `useField`, `useFormState`, `Field` (final-form compatible)
- FieldArray helpers and engine-level validators
- Lightweight: small core, lodash helpers for safe get/set
- Type declarations included for TypeScript consumers