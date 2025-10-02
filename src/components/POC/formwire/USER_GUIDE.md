# FormWire User Guide

Complete guide to using FormWire API with examples.

## Table of Contents

1. [Basic Usage](#basic-usage)
2. [Components](#components)
3. [Hooks](#hooks)
4. [FormEngine API](#formengine-api)
5. [Services](#services)
6. [Programmatic Control](#programmatic-control)
7. [Advanced Techniques](#advanced-techniques)

## Basic Usage

### Simple Form

```jsx
import { Form, Field } from './src';

function SimpleForm() {
  return (
    <Form onSubmit={(values) => console.log(values)}>
      <Field name="email">
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

### Form with Validation

```jsx
function ValidatedForm() {
  return (
    <Form onSubmit={(values) => console.log(values)}>
      <Field
        name="email"
        validate={(value) => {
          if (!value) return 'Email is required';
          if (!value.includes('@')) return 'Invalid email';
          return undefined;
        }}
        validateOn="blur"
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

## Components

### Form

Root form component.

#### Props

```typescript
interface FormProps {
  onSubmit: (values: object) => void | Promise<void>;
  initialValues?: object;
  defaultValidateOn?: 'blur' | 'change';
  engine?: FormEngine;
  children: React.ReactNode;
}
```

#### Examples

**Basic form:**
```jsx
<Form onSubmit={(values) => console.log(values)}>
  {/* form fields */}
</Form>
```

**Form with initial values:**
```jsx
<Form 
  onSubmit={(values) => console.log(values)}
  initialValues={{ email: 'user@example.com', name: 'John' }}
>
  {/* form fields */}
</Form>
```

**Form with external engine:**
```jsx
const engine = new FormEngine();
engine.init({ email: '', name: '' });

<Form engine={engine} onSubmit={(values) => console.log(values)}>
  {/* form fields */}
</Form>
```

### Field

Field component with validation and optimization.

#### Props

```typescript
interface FieldProps {
  name: string;
  component?: React.ComponentType<any>;
  children?: (props: FieldRenderProps) => React.ReactNode;
  validate?: (value: any, allValues: object) => string | undefined | Promise<string | undefined>;
  validateOn?: 'blur' | 'change' | 'submit';
  debounceDelay?: number;
  subscription?: {
    value?: boolean;
    error?: boolean;
    touched?: boolean;
    active?: boolean;
  };
}
```

#### FieldRenderProps

```typescript
interface FieldRenderProps {
  input: {
    name: string;
    value: any;
    onChange: (event: any) => void;
    onBlur: () => void;
    onFocus: () => void;
  };
  meta: {
    error: string;
    touched: boolean;
    active: boolean;
    dirty: boolean;
  };
  value: any;
  error: string;
}
```

#### Examples

**Simple field:**
```jsx
<Field name="email">
  {({ input, meta }) => (
    <div>
      <input {...input} placeholder="Email" />
      {meta.error && <span>{meta.error}</span>}
    </div>
  )}
</Field>
```

**Field with validation:**
```jsx
<Field
  name="email"
  validate={(value) => {
    if (!value) return 'Email is required';
    if (!value.includes('@')) return 'Invalid email';
    return undefined;
  }}
  validateOn="blur"
>
  {({ input, meta }) => (
    <div>
      <input {...input} placeholder="Email" />
      {meta.error && <span style={{ color: 'red' }}>{meta.error}</span>}
    </div>
  )}
</Field>
```

**Field with debounced validation:**
```jsx
<Field
  name="search"
  validate={(value) => {
    if (value.length < 3) return 'Minimum 3 characters';
    return undefined;
  }}
  validateOn="change"
  debounceDelay={300}
>
  {({ input, meta }) => (
    <div>
      <input {...input} placeholder="Search..." />
      {meta.error && <span>{meta.error}</span>}
    </div>
  )}
</Field>
```

**With validation only on submit:**
```jsx
<Field
  name="optionalField"
  validate={(value) => {
    if (value && value.length < 5) return 'Must be at least 5 characters';
    return undefined;
  }}
  validateOn="submit"
>
  {({ input, meta }) => (
    <div>
      <input {...input} placeholder="Optional field" />
      {meta.error && <span>{meta.error}</span>}
    </div>
  )}
</Field>
```

> **Note**: Fields with `validateOn="submit"` are validated only on form submission. Errors are cleared on blur (`onBlur`) for better UX.

**Field with custom component:**
```jsx
<Field name="email" component={CustomInput} />

// CustomInput will receive props:
// { name, value, onChange, onBlur, onFocus, error, meta }
```

**Field with selective subscriptions:**
```jsx
<Field
  name="email"
  subscription={{ value: true, error: true, touched: false, active: false }}
>
  {({ input, meta }) => (
    <div>
      <input {...input} placeholder="Email" />
      {meta.error && <span>{meta.error}</span>}
    </div>
  )}
</Field>
```

### FieldArray

Component for working with field arrays.

#### Props

```typescript
interface FieldArrayProps {
  name: string;
  children: (props: FieldArrayRenderProps) => React.ReactNode;
}
```

#### FieldArrayRenderProps

```typescript
interface FieldArrayRenderProps {
  fields: Array<{ __id: string; [key: string]: any }>;
  push: (item: any) => void;
  pop: () => void;
  remove: (index: number) => void;
  move: (from: number, to: number) => void;
  insert: (index: number, item: any) => void;
}
```

#### Examples

**Simple array:**
```jsx
<FieldArray name="items">
  {({ fields, push, remove }) => (
    <div>
      {fields.map((field, index) => (
        <div key={field.__id}>
          <Field name={`items[${index}].name`}>
            {({ input }) => <input {...input} placeholder="Item name" />}
          </Field>
          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={() => push({ name: '' })}>
        Add Item
      </button>
    </div>
  )}
</FieldArray>
```

**Complex array with validation:**
```jsx
<FieldArray name="users">
  {({ fields, push, remove, move }) => (
    <div>
      {fields.map((field, index) => (
        <div key={field.__id}>
          <Field
            name={`users[${index}].email`}
            validate={(value) => {
              if (!value) return 'Email is required';
              if (!value.includes('@')) return 'Invalid email';
              return undefined;
            }}
          >
            {({ input, meta }) => (
              <div>
                <input {...input} placeholder="Email" />
                {meta.error && <span>{meta.error}</span>}
              </div>
            )}
          </Field>
          
          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>
          <button type="button" onClick={() => move(index, index - 1)}>
            Move Up
          </button>
          <button type="button" onClick={() => move(index, index + 1)}>
            Move Down
          </button>
        </div>
      ))}
      
      <button type="button" onClick={() => push({ email: '' })}>
        Add User
      </button>
    </div>
  )}
</FieldArray>
```

## Hooks

### useField

Hook for managing field state.

```typescript
function useField(
  name: string,
  options?: {
    validate?: (value: any, allValues: object) => string | undefined | Promise<string | undefined>;
    validateOn?: 'blur' | 'change' | 'submit';
    debounceDelay?: number;
    subscription?: {
      value?: boolean;
      error?: boolean;
      touched?: boolean;
      active?: boolean;
    };
  }
): {
  value: any;
  onChange: (event: any) => void;
  onBlur: () => void;
  onFocus: () => void;
  error: string;
  touched: boolean;
  active: boolean;
  input: { name: string; value: any; onChange: (event: any) => void; onBlur: () => void; onFocus: () => void };
  meta: { error: string; touched: boolean; active: boolean };
}
```

#### Examples

**Basic usage:**
```jsx
function CustomField({ name }) {
  const { input, meta } = useField(name);
  
  return (
    <div>
      <input {...input} />
      {meta.error && <span>{meta.error}</span>}
    </div>
  );
}
```

**With validation:**
```jsx
function ValidatedField({ name }) {
  const { input, meta } = useField(name, {
    validate: (value) => {
      if (!value) return 'Required';
      return undefined;
    },
    validateOn: 'blur'
  });
  
  return (
    <div>
      <input {...input} />
      {meta.error && <span>{meta.error}</span>}
    </div>
  );
}
```

**With debounced validation:**
```jsx
function DebouncedField({ name }) {
  const { input, meta } = useField(name, {
    validate: (value) => {
      if (value.length < 3) return 'Too short';
      return undefined;
    },
    validateOn: 'change',
    debounceDelay: 300
  });
  
  return (
    <div>
      <input {...input} />
      {meta.error && <span>{meta.error}</span>}
    </div>
  );
}
```

### useFormState

Hook for subscribing to form state.

```typescript
function useFormState(subscription?: {
  values?: boolean;
  errors?: boolean;
  touched?: boolean;
  active?: boolean;
  submitting?: boolean;
}): {
  values: object;
  errors: object;
  touched: string[];
  active: string;
  submitting: boolean;
  valid: boolean;
  dirty: boolean;
  pristine: boolean;
}
```

#### Examples

**Full form state:**
```jsx
function FormStatus() {
  const formState = useFormState();
  
  return (
    <div>
      <p>Valid: {formState.valid ? 'Yes' : 'No'}</p>
      <p>Dirty: {formState.dirty ? 'Yes' : 'No'}</p>
      <p>Submitting: {formState.submitting ? 'Yes' : 'No'}</p>
      <p>Errors: {Object.keys(formState.errors).length}</p>
    </div>
  );
}
```

**Selective subscription:**
```jsx
function FormErrors() {
  const { errors } = useFormState({ errors: true });
  
  return (
    <div>
      {Object.entries(errors).map(([field, error]) => (
        <div key={field}>{field}: {error}</div>
      ))}
    </div>
  );
}
```

### useWatch

Hook for watching specific field.

```typescript
function useWatch<T>(
  name: string,
  selector?: (value: any) => T
): T
```

#### Examples

**Simple watching:**
```jsx
function EmailDisplay() {
  const email = useWatch('email');
  
  return <div>Current email: {email}</div>;
}
```

**With selector:**
```jsx
function EmailLength() {
  const emailLength = useWatch('email', (value) => value?.length || 0);
  
  return <div>Email length: {emailLength}</div>;
}
```

**Conditional rendering:**
```jsx
function ConditionalField() {
  const userType = useWatch('userType');
  
  if (userType === 'admin') {
    return <Field name="adminCode">{/* ... */}</Field>;
  }
  
  return null;
}
```

### useFormSubmit

Hook for handling form submission.

```typescript
function useFormSubmit(
  onSubmit: (values: object) => void | Promise<void>
): {
  handleSubmit: (event: any) => void;
  submitting: boolean;
}
```

#### Examples

**Basic submission:**
```jsx
function SubmitButton() {
  const { handleSubmit, submitting } = useFormSubmit(async (values) => {
    await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(values)
    });
  });
  
  return (
    <button onClick={handleSubmit} disabled={submitting}>
      {submitting ? 'Submitting...' : 'Submit'}
    </button>
  );
}
```

**With error handling:**
```jsx
function SubmitWithErrorHandling() {
  const { handleSubmit, submitting } = useFormSubmit(async (values) => {
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: JSON.stringify(values)
      });
      
      if (!response.ok) {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Submit error:', error);
      // Error will be handled by FormEngine
    }
  });
  
  return (
    <button onClick={handleSubmit} disabled={submitting}>
      {submitting ? 'Submitting...' : 'Submit'}
    </button>
  );
}
```

## FormEngine API

### Creation and Initialization

```typescript
const engine = new FormEngine(services?: {
  validationService?: ValidationService;
  cacheService?: CacheService;
  eventService?: EventService;
  batchService?: BatchService;
});
```

#### Examples

**Creation with default services:**
```javascript
const engine = new FormEngine();
engine.init({ email: '', name: '' });
```

**With custom services:**
```javascript
const validationService = new ValidationService({
  debounceDelay: 500,
  validateOnChange: true
});

const engine = new FormEngine({
  validationService
});

engine.init({ email: '', name: '' }, {
  validateOnBlur: true,
  enableBatching: true
});
```

### Main Methods

#### init(initialValues, config)

Form initialization.

```typescript
engine.init(initialValues?: object, config?: {
  enableBatching?: boolean;
  batchDelay?: number;
  enableValidation?: boolean;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
});
```

#### get(path)

Get value by path.

```typescript
const value = engine.get('user.email');
const nestedValue = engine.get('items[0].title');
```

#### set(path, value, options)

Set value.

```typescript
engine.set('user.email', 'new@example.com');
engine.set('items[0].title', 'New Title', { immediate: true });
```

#### setMany(updates)

Bulk update values.

```typescript
engine.setMany([
  { path: 'user.email', value: 'new@example.com' },
  { path: 'user.name', value: 'John Doe' }
]);
```

#### batch(fn)

Execute operations in batch.

```typescript
engine.batch(() => {
  engine.set('user.email', 'new@example.com');
  engine.set('user.name', 'John Doe');
  engine.touch('user.email');
});
```

### Validation

#### registerValidator(path, validator)

Register validator.

```typescript
engine.registerValidator('email', (value, allValues) => {
  if (!value) return 'Email is required';
  if (!value.includes('@')) return 'Invalid email';
  return undefined;
});
```

#### validateAll()

All fields validation.

```typescript
const isValid = await engine.validateAll();
if (!isValid) {
  const errors = engine.getErrors();
  console.log('Validation errors:', errors);
}
```

#### hasValidator(path)

Check validator existence.

```typescript
if (engine.hasValidator('email')) {
  console.log('Email validator is registered');
}
```

### State management

#### touch(path)

Mark field as touched.

```typescript
engine.touch('email');
```

#### focus(path) / blur()

Focus management.

```typescript
engine.focus('email');
engine.blur();
```

#### isTouched(path)

Check touched status.

```typescript
if (engine.isTouched('email')) {
  console.log('Email field has been touched');
}
```

### Events

#### on(event, callback, context)

Event subscription.

```typescript
const unsubscribe = engine.on('change', (data) => {
  console.log('Form changed:', data);
});

// Subscribe with context for automatic cleanup
const unsubscribe2 = engine.on('change', (data) => {
  console.log('Form changed:', data);
}, this);
```

#### Available events

- `init` - form initialization
- `change` - value changes
- `change:fieldName` - specific field change
- `error` - validation error
- `error:fieldName` - specific field error
- `touch` - field marked as touched
- `touch:fieldName` - specific field marked as touched
- `focus` - focus on field
- `focus:fieldName` - focus on specific field
- `blur` - remove focus
- `validation` - validate all fields
- `submit` - form submission

### Form submission

#### submit(onSubmit)

Form submission with validation.

```typescript
const result = await engine.submit(async (values) => {
  const response = await fetch('/api/submit', {
    method: 'POST',
    body: JSON.stringify(values)
  });
  return response.json();
});

if (result.success) {
  console.log('Form submitted successfully:', result.values);
} else {
  console.log('Form submission failed:', result.errors);
}
```

## Services

### ValidationService

Validation service with debouncing support.

```typescript
const validationService = new ValidationService({
  debounceDelay: 300,
  validateOnChange: false,
  validateOnBlur: true
});
```

#### Methods

- `registerValidator(path, validator)` - register validator
- `validateField(path, value, allValues)` - validate field
- `validateAll(allValues)` - validate all fields
- `createDebouncedValidator(validator, delay)` - create debounced validator
- `updateConfig(newConfig)` - update configuration

### CacheService

Caching service with WeakMap.

```typescript
const cacheService = new CacheService({
  enableValueCache: true,
  enableFormStateCache: true,
  maxCacheSize: 1000
});
```

#### Methods

- `getValue(key, computeFn)` - get value from cache
- `getFormState(formState, computeFn)` - get state from cache
- `clearForPath(path)` - clear cache for path
- `clearAll()` - full cache cleanup
- `getStats()` - cache statistics

### EventService

Event service with automatic cleanup.

```typescript
const eventService = new EventService({
  enableContextTracking: true,
  enableErrorHandling: true
});
```

#### Methods

- `on(event, callback, context)` - subscribe to event
- `emit(event, data)` - emit event
- `removeAllListenersForEvent(event)` - remove event listeners
- `removeAllListeners()` - remove all listeners
- `getStats()` - event statistics

### BatchService

Operation batching service.

```typescript
const batchService = new BatchService({
  enableBatching: true,
  batchDelay: 100,
  maxBatchSize: 100
});
```

#### Methods

- `batch(fn, onFlush)` - execute operations in batch
- `queueOperation(operation)` - add operation to queue
- `clear()` - clear queue
- `getStats()` - batching statistics

## Programmatic Control

### Programmatic Value Changes

```jsx
function ProgrammaticForm() {
  const engine = useFormEngine();
  
  const handleReset = () => {
    engine.set('email', '');
    engine.set('name', '');
    engine.clearError('email');
    engine.clearError('name');
  };
  
  const handleFillSample = () => {
    engine.setMany([
      { path: 'email', value: 'sample@example.com' },
      { path: 'name', value: 'John Doe' }
    ]);
  };
  
  const handleValidate = async () => {
    const isValid = await engine.validateAll();
    if (!isValid) {
      const errors = engine.getErrors();
      console.log('Validation errors:', errors);
    }
  };
  
  return (
    <div>
      <Field name="email">{/* ... */}</Field>
      <Field name="name">{/* ... */}</Field>
      
      <button onClick={handleReset}>Reset</button>
      <button onClick={handleFillSample}>Fill Sample</button>
      <button onClick={handleValidate}>Validate</button>
    </div>
  );
}
```

### Dynamic Field Addition

```jsx
function DynamicForm() {
  const engine = useFormEngine();
  const [fieldCount, setFieldCount] = useState(1);
  
  const addField = () => {
    const newCount = fieldCount + 1;
    setFieldCount(newCount);
    engine.set(`field${newCount}`, '');
  };
  
  const removeField = (index) => {
    engine.set(`field${index}`, undefined);
    setFieldCount(fieldCount - 1);
  };
  
  return (
    <div>
      {Array.from({ length: fieldCount }, (_, i) => (
        <div key={i}>
          <Field name={`field${i + 1}`}>
            {({ input }) => <input {...input} placeholder={`Field ${i + 1}`} />}
          </Field>
          <button onClick={() => removeField(i + 1)}>Remove</button>
        </div>
      ))}
      
      <button onClick={addField}>Add Field</button>
    </div>
  );
}
```

### Conditional Validation

```jsx
function ConditionalValidation() {
  const userType = useWatch('userType');
  
  return (
    <div>
      <Field name="userType">
        {({ input }) => (
          <select {...input}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        )}
      </Field>
      
      <Field name="email">
        {({ input, meta }) => (
          <div>
            <input {...input} placeholder="Email" />
            {meta.error && <span>{meta.error}</span>}
          </div>
        )}
      </Field>
      
      {userType === 'admin' && (
        <Field
          name="adminCode"
          validate={(value) => {
            if (!value) return 'Admin code is required';
            if (value.length < 6) return 'Admin code must be at least 6 characters';
            return undefined;
          }}
        >
          {({ input, meta }) => (
            <div>
              <input {...input} placeholder="Admin Code" />
              {meta.error && <span>{meta.error}</span>}
            </div>
          )}
        </Field>
      )}
    </div>
  );
}
```

### Programmatic Submission

```jsx
function ProgrammaticSubmit() {
  const engine = useFormEngine();
  
  const handleSave = async () => {
    const result = await engine.submit(async (values) => {
      await fetch('/api/save', {
        method: 'POST',
        body: JSON.stringify(values)
      });
    });
    
    if (result.success) {
      console.log('Saved successfully');
    } else {
      console.log('Save failed:', result.errors);
    }
  };
  
  const handleSaveAndContinue = async () => {
    const result = await engine.submit(async (values) => {
      await fetch('/api/save', {
        method: 'POST',
        body: JSON.stringify(values)
      });
    });
    
    if (result.success) {
      // Move to next step
      window.location.href = '/next-step';
    }
  };
  
  return (
    <div>
      <Field name="email">{/* ... */}</Field>
      <Field name="name">{/* ... */}</Field>
      
      <button onClick={handleSave}>Save</button>
      <button onClick={handleSaveAndContinue}>Save & Continue</button>
    </div>
  );
}
```

## Advanced Techniques

### Custom services

```javascript
class CustomValidationService extends ValidationService {
  constructor(options = {}) {
    super(options);
    this.customRules = new Map();
  }
  
  registerCustomRule(name, rule) {
    this.customRules.set(name, rule);
  }
  
  validateField(path, value, allValues) {
    // Apply custom rules
    for (const [ruleName, rule] of this.customRules) {
      const error = rule(value, allValues);
      if (error) return error;
    }
    
    return super.validateField(path, value, allValues);
  }
}

// Usage
const customValidationService = new CustomValidationService();
customValidationService.registerCustomRule('noSpaces', (value) => {
  if (value && value.includes(' ')) {
    return 'No spaces allowed';
  }
  return undefined;
});

const engine = new FormEngine({
  validationService: customValidationService
});
```

### Custom hooks

```javascript
function useFieldWithHistory(name, options = {}) {
  const fieldState = useField(name, options);
  const [history, setHistory] = useState([]);
  
  const onChange = useCallback((event) => {
    const newValue = event.target ? event.target.value : event;
    
    setHistory(prev => [...prev, {
      value: newValue,
      timestamp: Date.now()
    }]);
    
    fieldState.onChange(event);
  }, [fieldState.onChange]);
  
  const undo = useCallback(() => {
    if (history.length > 1) {
      const previousValue = history[history.length - 2].value;
      fieldState.onChange({ target: { value: previousValue } });
      setHistory(prev => prev.slice(0, -1));
    }
  }, [history, fieldState.onChange]);
  
  return {
    ...fieldState,
    onChange,
    history,
    undo,
    canUndo: history.length > 1
  };
}
```

### Integration with External Libraries

```javascript
// Integration with React Hook Form
function useFormWireWithRHF() {
  const { register, handleSubmit, formState } = useForm();
  const engine = useFormEngine();
  
  useEffect(() => {
    // Sync with React Hook Form
    const unsubscribe = engine.on('change', (data) => {
      if (data.path && data.value !== undefined) {
        setValue(data.path, data.value);
      }
    });
    
    return unsubscribe;
  }, [engine]);
  
  return {
    register,
    handleSubmit,
    formState,
    engine
  };
}
```

### Testing

```javascript
// Component testing
import { render, screen, fireEvent } from '@testing-library/react';
import { Form, Field } from './src';

test('validates email field', async () => {
  render(
    <Form onSubmit={jest.fn()}>
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
            <input {...input} data-testid="email-input" />
            {meta.error && <span data-testid="email-error">{meta.error}</span>}
          </div>
        )}
      </Field>
    </Form>
  );
  
  const input = screen.getByTestId('email-input');
  const errorElement = screen.queryByTestId('email-error');
  
  // Initially no errors
  expect(errorElement).toBeNull();
  
  // Enter invalid email
  fireEvent.change(input, { target: { value: 'invalid-email' } });
  fireEvent.blur(input);
  
  // Check that error appeared
  await screen.findByTestId('email-error');
  expect(screen.getByTestId('email-error')).toHaveTextContent('Invalid email');
});
```

```javascript
// Testing FormEngine
import { FormEngine } from './src';

test('validates all fields', async () => {
  const engine = new FormEngine();
  engine.init({ email: '', name: '' });
  
  engine.registerValidator('email', (value) => {
    if (!value) return 'Email is required';
    return undefined;
  });
  
  engine.registerValidator('name', (value) => {
    if (!value) return 'Name is required';
    return undefined;
  });
  
  const isValid = await engine.validateAll();
  expect(isValid).toBe(false);
  
  const errors = engine.getErrors();
  expect(errors.email).toBe('Email is required');
  expect(errors.name).toBe('Name is required');
});
```

This is a complete guide to using FormWire API. All examples are tested and ready for production use.
