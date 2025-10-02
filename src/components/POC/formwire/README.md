# FormWire

Ultra-lightweight form state management library for React with service injection architecture.

## Features

- **Service Injection Architecture** - Modular, testable, and extensible
- **Zero Dependencies** - No external dependencies
- **High Performance** - Optimized with WeakMap caching and microtask batching
- **TypeScript Ready** - Full type support
- **React Hooks** - Modern React patterns
- **Debounced Validation** - Built-in validation with debouncing
- **Memory Efficient** - Automatic cleanup with WeakMap

## Quick Start

```jsx
import { Form, Field } from './src';

function MyForm() {
  return (
    <Form onSubmit={(values) => console.log(values)}>
      <Field
        name="email"
        validate={(value) => {
          if (!value) return 'Email is required';
          if (!value.includes('@')) return 'Invalid email';
          return undefined;
        }}
      >
        {({ input, meta }) => (
          <div>
            <input {...input} placeholder="Email" />
            {meta.error && <span style={{ color: 'red' }}>{meta.error}</span>}
          </div>
        )}
      </Field>
      
      <button type="submit">Submit</button>
    </Form>
  );
}
```

## Architecture

### Service Injection

FormWire uses a service injection pattern for maximum flexibility:

```jsx
import { FormEngine, ValidationService, CacheService, EventService, BatchService } from './src';

// Create custom services
const validationService = new ValidationService({
  debounceDelay: 300,
  validateOnChange: true,
});

const cacheService = new CacheService({
  enableValueCache: true,
  maxCacheSize: 1000,
});

const eventService = new EventService({
  enableContextTracking: true,
  enableErrorHandling: true,
});

const batchService = new BatchService({
  enableBatching: true,
  batchDelay: 100,
});

// Create engine with custom services
const engine = new FormEngine({
  validationService,
  cacheService,
  eventService,
  batchService,
});

// Initialize form
engine.init({ email: '', name: '' }, { validateOnBlur: true });
```

### Core Services

- **ValidationService** - Handles field validation with debouncing
- **CacheService** - Manages WeakMap-based caching for performance
- **EventService** - Event system with automatic cleanup
- **BatchService** - Batches operations for optimal performance

## API Reference

### Form Component

```jsx
<Form
  onSubmit={(values) => void}
  initialValues={object}
  defaultValidateOn="blur" | "change"
  engine={FormEngine}
>
  {children}
</Form>
```

### Field Component

```jsx
<Field
  name="fieldName"
  validate={(value, allValues) => string | undefined}
  validateOn="blur" | "change"
  debounceDelay={number}
  subscription={object}
>
  {({ input, meta }) => JSX}
</Field>
```

### Hooks

- `useField(name, options)` - Field state and handlers
- `useFormState(subscription)` - Form state
- `useWatch(name, selector)` - Watch specific field
- `useFormSubmit(onSubmit)` - Form submission

### FormEngine

```jsx
const engine = new FormEngine(services);

// Core methods
engine.init(initialValues, config);
engine.get(path);
engine.set(path, value);
engine.validateAll();
engine.submit(onSubmit);

// Service management
engine.setValidationService(service);
engine.setCacheService(service);
engine.setEventService(service);
engine.setBatchService(service);
engine.getServiceStats();
```

## Performance

- **WeakMap Caching** - Automatic memory management
- **Microtask Batching** - Efficient update batching
- **Selective Subscriptions** - Only subscribe to needed state
- **Debounced Validation** - Reduces validation calls
- **Memoized Components** - Prevents unnecessary re-renders

## License

MIT