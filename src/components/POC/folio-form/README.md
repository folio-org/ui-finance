# Folio Form

Enhanced React Hook Form implementation with uncontrolled inputs for maximum performance.

## 🚀 Features

- **Uncontrolled Inputs** - Minimal re-renders for maximum performance
- **Ref-based** - Direct DOM manipulation for speed
- **TypeScript-first** - Full type safety
- **Zero dependencies** - Lightweight and fast
- **Validation** - Built-in validation with custom rules
- **Field Arrays** - Dynamic field management (coming soon)

## 📦 Installation

```bash
# Copy the src folder to your project
cp -r src/ your-project/src/folio-form/
```

## 🎯 Quick Start

```tsx
import React from 'react';
import { useForm, Form, commonRules } from './src';

interface FormData {
  firstName: string;
  email: string;
}

function MyForm() {
  const form = useForm<FormData>({
    defaultValues: {
      firstName: '',
      email: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = (data: FormData) => {
    console.log('Form data:', data);
  };

  return (
    <Form form={form} onSubmit={form.handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="firstName">First Name:</label>
        <input
          {...form.register('firstName', commonRules.required())}
          type="text"
          id="firstName"
        />
        {form.formState.errors.firstName && (
          <p style={{ color: 'red' }}>
            {form.formState.errors.firstName.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input
          {...form.register('email', {
            ...commonRules.required(),
            ...commonRules.email(),
          })}
          type="email"
          id="email"
        />
        {form.formState.errors.email && (
          <p style={{ color: 'red' }}>
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </Form>
  );
}
```

## 🔧 API Reference

### useForm

Main hook for form management.

```tsx
const form = useForm<T>(options);
```

#### Options

- `defaultValues` - Initial form values
- `mode` - Validation mode: 'onChange' | 'onBlur' | 'onSubmit' | 'all'
- `reValidateMode` - Re-validation mode
- `shouldFocusError` - Focus first error field
- `shouldUnregister` - Unregister fields on unmount

#### Methods

- `register(name, rules)` - Register a field
- `unregister(name)` - Unregister a field
- `setValue(name, value, options)` - Set field value
- `getValue(name)` - Get field value
- `getValues()` - Get all form values
- `setError(name, error)` - Set field error
- `clearErrors(name?)` - Clear field errors
- `trigger(name?)` - Trigger validation
- `reset(values?)` - Reset form
- `handleSubmit(onSubmit)` - Handle form submission
- `watch(name?)` - Watch field values

### Validation Rules

```tsx
import { commonRules } from './src';

// Built-in rules
commonRules.required('Custom message')
commonRules.email('Invalid email')
commonRules.minLength(3, 'Too short')
commonRules.maxLength(50, 'Too long')
commonRules.min(18, 'Too young')
commonRules.max(100, 'Too old')
commonRules.pattern(/^[A-Z]/, 'Must start with uppercase')

// Custom validation
{
  validate: (value, formValues) => {
    return value === formValues.password || 'Passwords must match';
  }
}
```

### Form State

```tsx
form.formState = {
  isDirty: boolean;        // Form has been modified
  isValid: boolean;        // Form is valid
  isSubmitting: boolean;   // Form is submitting
  isSubmitted: boolean;    // Form has been submitted
  submitCount: number;     // Number of submissions
  touchedFields: object;   // Touched field names
  dirtyFields: object;     // Dirty field names
  errors: object;          // Field errors
  values: object;          // Current form values
}
```

## 🏗️ Architecture

### Core Components

1. **FormEngine** - Core form state management
2. **useForm** - React hook for form integration
3. **Form** - Form wrapper component
4. **Controller** - Controlled field component
5. **Validation** - Built-in validation system

### Key Principles

- **Uncontrolled Inputs** - Direct DOM manipulation
- **Ref-based** - Minimal React re-renders
- **Event-driven** - Efficient state updates
- **Type-safe** - Full TypeScript support

## 🚀 Performance Benefits

- **Minimal Re-renders** - Only re-render when necessary
- **Direct DOM Access** - No virtual DOM overhead
- **Efficient Validation** - Only validate changed fields
- **Memory Optimized** - Automatic cleanup

## 📝 Examples

See `example.tsx` for a complete working example.

## 🔮 Roadmap

- [ ] Field Arrays support
- [ ] Advanced validation
- [ ] Form persistence
- [ ] DevTools integration
- [ ] More examples

## 📄 License

MIT
