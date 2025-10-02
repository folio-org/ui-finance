# FormWire Architecture

## Architecture Overview

FormWire is built on **Service Injection** and **Clean Architecture** principles. Each component has clearly defined responsibilities and can be easily replaced or tested.

## Architectural Principles

### 1. Service Injection Pattern
- **Dependency Inversion** - engine doesn't create services, receives them externally
- **Testability** - each service can be mocked
- **Flexibility** - services can be replaced at runtime
- **Modularity** - services are independent of each other

### 2. Separation of Concerns
- **FormEngine** - only coordination and state
- **Services** - specific business logic
- **React Components** - only presentation
- **Utils** - reusable utilities

### 3. Performance First
- **WeakMap caching** - automatic memory cleanup
- **Microtasks** - efficient batching
- **Selective subscriptions** - only needed updates
- **Memoization** - preventing unnecessary re-renders

## Detailed Structure

### Core Layer

#### FormEngine.js
**Purpose**: Central coordinator of the entire form system

**Responsibilities**:
- Form state management (values, errors, touched, active)
- Service coordination
- Public API provision
- Initialization and configuration

**Key Methods**:
```javascript
// Initialization
init(initialValues, config) - form setup
reset() - reset to initial state

// Data operations
get(path) - get value by path
set(path, value) - set value
setMany(updates) - bulk update

// Validation
registerValidator(path, validator) - register validator
validateAll() - validate all fields
hasValidator(path) - check validator existence

// State management
touch(path) - mark field as touched
focus(path) - focus on field
blur() - remove focus

// Events
on(event, callback) - subscribe to events
submit(onSubmit) - submit form

// Service management
setValidationService(service) - replace validation service
setCacheService(service) - replace cache service
setEventService(service) - replace event service
setBatchService(service) - replace batch service
getServiceStats() - all services statistics
```

**Internal State**:
```javascript
// Form state
this.values = Object.create(null)     // Field values
this.errors = Object.create(null)     // Validation errors
this.touched = new Set()              // Touched fields
this.active = null                    // Active field
this.submitting = false               // Submission status

// Configuration
this.options = {}                     // Form settings
this.isInitialized = false           // Initialization status

// Performance
this.operations = 0                   // Operations counter
this.renderCount = 0                  // Render counter
```

### Services Layer

#### ValidationService.js
**Purpose**: Field validation management with debouncing support

**Responsibilities**:
- Validator registration and storage
- Field validation execution
- Debounced validator creation
- Form-wide validation

**Internal State**:
```javascript
this.validators = new Map()           // Map<path, validator>
this.options = {                      // Validation settings
  debounceDelay: 300,
  validateOnChange: false,
  validateOnBlur: true
}
```

**Key Methods**:
```javascript
registerValidator(path, validator)    // Register validator
validateField(path, value, allValues) // Single field validation
validateAll(allValues)               // All fields validation
createDebouncedValidator(validator, delay) // Debounced validator creation
updateConfig(newConfig)              // Update configuration
```

**Features**:
- Sync and async validator support
- Automatic error handling
- Debouncing for performance
- Validation result caching

#### CacheService.js
**Purpose**: High-performance caching with automatic memory cleanup

**Responsibilities**:
- Field value caching
- Form state caching
- Automatic cleanup on changes
- Cache usage statistics

**Internal State**:
```javascript
this.valueCache = new WeakMap()       // Field value cache
this.formStateCache = new WeakMap()   // Form state cache
this.stats = {                        // Statistics
  hits: 0,
  misses: 0,
  size: 0
}
```

**Key Methods**:
```javascript
getValue(key, computeFn)              // Get value from cache
getFormState(formState, computeFn)    // Get state from cache
clearForPath(path)                    // Clear cache for path
clearAll()                            // Full cache cleanup
getStats()                            // Cache statistics
createValueKey(path, values)          // Cache key creation
```

**Features**:
- WeakMap for automatic memory cleanup
- Fast object hashing
- Selective cache cleanup
- Statistics for performance monitoring

#### EventService.js
**Purpose**: Event system with automatic cleanup and context tracking

**Responsibilities**:
- Event subscription management
- Event emission
- Automatic cleanup on context destruction
- Error handling in handlers

**Internal State**:
```javascript
this.listeners = new Map()            // Map<event, Set<callback>>
this.contexts = new WeakMap()        // WeakMap<context, Set<{event, callback}>>
this.stats = {                        // Statistics
  totalEvents: 0,
  totalListeners: 0,
  contextsCount: 0
}
```

**Key Methods**:
```javascript
on(event, callback, context)          // Subscribe to event
emit(event, data)                     // Emit event
removeAllListenersForEvent(event)     // Remove all listeners for event
removeAllListeners()                  // Remove all listeners
getListeners(event)                   // Get event listeners
hasListeners(event)                   // Check listeners existence
getStats()                            // Event statistics
resetStats()                          // Reset statistics
```

**Features**:
- WeakMap for automatic context cleanup
- Error handling in handlers
- Statistics for monitoring
- Context cleanup support

#### BatchService.js
**Purpose**: Efficient operation batching for performance optimization

**Responsibilities**:
- Group operations into batches
- Operation queue management
- Schedule batch execution
- Batching statistics

**Internal State**:
```javascript
this.batchQueue = []                  // Operation queue
this.isBatching = false               // Batching status
this.batchScheduled = false           // Scheduling status
this.batchTimeout = null              // Batch timer
this.stats = {                        // Statistics
  totalBatches: 0,
  totalOperations: 0,
  averageBatchSize: 0
}
```

**Key Methods**:
```javascript
batch(fn, onFlush)                    // Execute operations in batch
queueOperation(operation)             // Add operation to queue
clear()                               // Clear queue
updateConfig(newConfig)               // Update configuration
getStats()                            // Batching statistics
resetStats()                          // Reset statistics
```

**Features**:
- Microtasks for immediate batching
- Timers for delayed batching
- Statistics for monitoring
- Configurable batching parameters

### React Layer (React components)

#### Form.js
**Purpose**: Root form component with context provider

**Responsibilities**:
- Create and initialize FormEngine
- Provide context to child components
- Handle form submission
- Manage engine lifecycle

**Props**:
```javascript
onSubmit: (values) => void           // Submit handler
initialValues: object                // Initial values
defaultValidateOn: 'blur' | 'change' // Default validation mode
engine: FormEngine                   // External engine (optional)
```

**Features**:
- Automatic engine creation when needed
- Reuse external engine
- Context for child components
- Handle submission errors

#### Field.js
**Purpose**: Field component with optimized subscriptions and validation

**Responsibilities**:
- Field state management
- Subscribe to field changes
- Validation with debouncing
- Provide props for components

**Props**:
```javascript
name: string                          // Field name
component: Component                  // Component for rendering
children: function                    // Render function
validate: (value, allValues) => string // Validator
validateOn: 'blur' | 'change'        // Validation mode
debounceDelay: number                 // Debouncing delay
subscription: object                  // Selective subscriptions
```

**Returned Props**:
```javascript
// For component
{
  name: string,
  value: any,
  onChange: (event) => void,
  onBlur: () => void,
  onFocus: () => void,
  error: string,
  meta: {
    error: string,
    touched: boolean,
    active: boolean,
    dirty: boolean
  }
}

// For children function
{
  input: { name, value, onChange, onBlur, onFocus },
  meta: { error, touched, active, dirty },
  value: any,
  error: string
}
```

**Features**:
- Props memoization for performance
- Selective subscriptions to events
- Debounced validation
- Support for different render modes

#### FieldArray.js
**Purpose**: Component for working with field arrays

**Responsibilities**:
- Manage field array
- Provide manipulation methods
- Generate stable IDs for fields
- Render optimization

**Props**:
```javascript
name: string                          // Array name
children: function                    // Render function
```

**Returned Methods**:
```javascript
{
  fields: Array<{__id: string, ...field}>,
  push: (item) => void,
  pop: () => void,
  remove: (index) => void,
  move: (from, to) => void,
  insert: (index, item) => void
}
```

**Features**:
- Stable IDs for React optimization
- Memoized manipulation methods
- Automatic updates on changes
- Support for complex array operations

#### FormContext.js
**Purpose**: React context for providing access to FormEngine

**Responsibilities**:
- Provide FormEngine through context
- Hooks for engine access
- Context typing

**Exports**:
```javascript
FormProvider                         // Context provider
useFormEngine                        // Hook for engine access
useFormContext                       // Hook for context access
```

### Hooks Layer (React hooks)

#### useField.js
**Purpose**: Hook for managing field state

**Responsibilities**:
- Subscribe to field changes
- Validation management
- Provide event handlers
- Optimize re-renders

**Parameters**:
```javascript
name: string                          // Field name
options: {
  validate: function,                 // Validator
  validateOn: 'blur' | 'change',     // Validation mode
  debounceDelay: number,              // Debouncing delay
  subscription: object                // Selective subscriptions
}
```

**Return Value**:
```javascript
{
  value: any,                         // Field value
  onChange: (event) => void,         // Change handler
  onBlur: () => void,                 // Blur handler
  onFocus: () => void,                // Focus handler
  error: string,                      // Validation error
  touched: boolean,                   // Touched status
  active: boolean,                    // Active status
  input: { name, value, onChange, onBlur, onFocus },
  meta: { error, touched, active }
}
```

**Features**:
- useReducer for state management
- useCallback for handler optimization
- useMemo for value memoization
- Automatic subscription cleanup

#### useFormState.js
**Purpose**: Hook for subscribing to form state

**Responsibilities**:
- Subscribe to form changes
- Selective subscriptions
- Optimize re-renders

**Parameters**:
```javascript
subscription: {
  values: boolean,                    // Subscribe to values
  errors: boolean,                    // Subscribe to errors
  touched: boolean,                   // Subscribe to touched
  active: boolean,                    // Subscribe to active
  submitting: boolean                // Subscribe to submitting
}
```

**Return Value**:
```javascript
{
  values: object,                     // Form values
  errors: object,                     // Validation errors
  touched: string[],                  // Touched fields
  active: string,                     // Active field
  submitting: boolean,                // Submission status
  valid: boolean,                     // Form validity
  dirty: boolean,                      // Dirty status
  pristine: boolean                   // Pristine status
}
```

**Features**:
- useReducer for state management
- Selective subscriptions to events
- Automatic subscription cleanup
- Optimize re-renders

#### useWatch.js
**Purpose**: Hook for watching specific field

**Responsibilities**:
- Subscribe to field changes
- Selector support
- Optimize re-renders

**Parameters**:
```javascript
name: string                          // Field name
selector: (value) => any              // Selector for transformation
```

**Return Value**:
```javascript
any                                  // Field value (transformed)
```

**Features**:
- Selector support for transformation
- Automatic subscription cleanup
- Optimize re-renders

#### useFormSubmit.js
**Purpose**: Hook for handling form submission

**Responsibilities**:
- Handle form submission
- Prevent default submission
- Error handling

**Parameters**:
```javascript
onSubmit: (values) => void            // Submit handler
```

**Return Value**:
```javascript
{
  handleSubmit: (event) => void,      // Submit handler
  submitting: boolean                // Submission status
}
```

**Features**:
- useCallback for optimization
- Automatic default submission prevention
- Handle submission errors

### Utils Layer (Utilities)

#### path.js
**Purpose**: Utilities for working with object paths

**Responsibilities**:
- Parse paths into key arrays
- Navigate objects
- Get values by paths
- Set values by paths
- Check path existence
- Delete values by paths

**Functions**:
```javascript
parsePath(path)                       // Parse path into key array
navigateToPath(obj, keys, createMissing) // Navigate object
getByPath(obj, path)                  // Get value by path
setByPath(obj, path, value)           // Set value by path
hasPath(obj, path)                    // Check path existence
deleteByPath(obj, path)               // Delete value by path
```

**Features**:
- Nested path support (user.profile.name)
- Array support (items[0].title)
- Create missing objects
- Immutable operations

#### hash.js
**Purpose**: Fast object hashing for caching

**Responsibilities**:
- Create deterministic hashes
- Fast hashing of large objects
- Support for various data types
- Optimization for caching

**Functions**:
```javascript
hashObject(obj)                       // Object hashing
hashFormState(formState)              // Form state hashing
```

**Features**:
- 10x faster than JSON.stringify
- Deterministic hashes
- Support for all data types
- Optimization for large objects

#### validation.js
**Purpose**: Utilities for field validation

**Responsibilities**:
- Field validation with error handling
- Sync and async validator support
- Validation error handling

**Functions**:
```javascript
validateField(validator, value, allValues, engine, fieldName) // Field validation
```

**Features**:
- Async/await support
- Validation error handling
- Integration with FormEngine

## Data Flows

### 1. Form initialization
```
Form → FormEngine.init() → Services.configure() → EventService.emit(INIT)
```

### 2. Field value change
```
Field.onChange → FormEngine.set() → CacheService.clearForPath() → 
ValidationService.validateField() → EventService.emit(CHANGE) → 
Field re-render
```

### 3. Field Validation
```
Field.onBlur → FormEngine.touch() → ValidationService.validateField() → 
FormEngine.setError/clearError() → EventService.emit(ERROR) → 
Field re-render
```

### 4. Form submission
```
Form.onSubmit → FormEngine.submit() → ValidationService.validateAll() → 
onSubmit(values) → EventService.emit(SUBMIT)
```

## Performance

### Caching
- **WeakMap** for automatic memory cleanup
- **Fast hashing** objects (10x faster than JSON.stringify)
- **Selective cleanup** cache on changes
- **Statistics** for performance monitoring

### Batching
- **Microtasks** for immediate batching
- **Timers** for delayed batching
- **Grouping** operations for optimization
- **Configurable** batching parameters

### Subscriptions
- **Selective subscriptions** to events
- **Automatic cleanup** on unmount
- **Context cleanup** via WeakMap
- **Optimization** re-renders

### Memoization
- **useMemo** for expensive computations
- **useCallback** for stable functions
- **useReducer** for complex state
- **Memoization** component props

## Testing

### Service mocking
```javascript
const mockValidationService = {
  registerValidator: jest.fn(),
  validateField: jest.fn().mockResolvedValue(null),
  validateAll: jest.fn().mockResolvedValue({}),
  createDebouncedValidator: jest.fn()
};

const engine = new FormEngine({
  validationService: mockValidationService
});
```

### Component testing
```javascript
import { render, screen } from '@testing-library/react';
import { Form, Field } from './src';

test('renders field with validation', () => {
  render(
    <Form onSubmit={jest.fn()}>
      <Field name="email" validate={(value) => !value ? 'Required' : undefined}>
        {({ input, meta }) => (
          <div>
            <input {...input} />
            {meta.error && <span>{meta.error}</span>}
          </div>
        )}
      </Field>
    </Form>
  );
});
```

## Extensibility

### Custom services
```javascript
class CustomValidationService extends ValidationService {
  validateField(path, value, allValues) {
    // Custom validation logic
    return super.validateField(path, value, allValues);
  }
}

const engine = new FormEngine({
  validationService: new CustomValidationService()
});
```

### Custom hooks
```javascript
function useCustomField(name, options) {
  const fieldState = useField(name, options);
  
  // Custom logic
  return {
    ...fieldState,
    customProp: 'value'
  };
}
```

### Custom components
```javascript
function CustomField({ name, ...props }) {
  return (
    <Field name={name} {...props}>
      {({ input, meta }) => (
        <div className="custom-field">
          <input {...input} className={meta.error ? 'error' : ''} />
          {meta.error && <div className="error-message">{meta.error}</div>}
        </div>
      )}
    </Field>
  );
}
```

## Conclusion

FormWire is a modern, high-performance form management library built on Clean Architecture and Service Injection principles. The architecture provides:

- **Modularity** - each component has clear responsibility
- **Testability** - all components can be easily tested
- **Performance** - optimizations at all levels
- **Extensibility** - easy to add new features
- **Reliability** - automatic memory cleanup and error handling