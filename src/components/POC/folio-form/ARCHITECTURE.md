# Folio Form Architecture

## 🏗️ Overview

Folio Form is an enhanced React Hook Form implementation that prioritizes performance through uncontrolled inputs and direct DOM manipulation.

## 🎯 Core Principles

### 1. Uncontrolled Inputs
- **No state management** for field values
- **Direct DOM access** via refs
- **Minimal re-renders** - only when necessary
- **Maximum performance** for large forms

### 2. Ref-based Architecture
- **Direct DOM manipulation** for speed
- **No virtual DOM overhead** for field updates
- **Immediate value access** without state updates
- **Efficient validation** on demand

### 3. Event-driven Updates
- **Form state changes** trigger events
- **Selective re-renders** only for affected components
- **Efficient validation** only when needed
- **Minimal memory footprint**

## 📁 Project Structure

```
src/
├── core/
│   └── FormEngine.ts          # Core form state management
├── hooks/
│   ├── useForm.ts            # Main form hook
│   ├── useController.ts      # Controlled field hook
│   └── useWatch.ts           # Field watching hook
├── components/
│   ├── Form.tsx              # Form wrapper component
│   ├── FormProvider.tsx      # Context provider
│   └── Controller.tsx        # Controlled field component
├── types/
│   └── index.ts              # TypeScript definitions
├── utils/
│   ├── index.ts              # Utility functions
│   └── validation.ts         # Validation system
└── index.ts                  # Main exports
```

## 🔧 Key Components

### FormEngine
- **Core state management** without React
- **Field registration** and tracking
- **Validation system** with async support
- **Event system** for state updates
- **Value management** via DOM manipulation

### useForm Hook
- **React integration** with FormEngine
- **State synchronization** via events
- **Field registration** methods
- **Validation triggers** and error handling
- **Form submission** management

### Form Component
- **Context provider** for form state
- **Event handling** for submission
- **Accessibility** support
- **Styling** and layout options

## 🚀 Performance Features

### 1. Uncontrolled Inputs
```tsx
// No state updates on every keystroke
<input {...form.register('name')} />
```

### 2. Direct DOM Access
```tsx
// Direct value access without state
const value = element.value;
```

### 3. Event-driven Updates
```tsx
// Only update when necessary
useEffect(() => {
  const unsubscribe = engine.on('change', updateState);
  return unsubscribe;
}, []);
```

### 4. Efficient Validation
```tsx
// Only validate changed fields
const isValid = await validateField(name, rules, values);
```

## 🔄 Data Flow

1. **Field Registration** → FormEngine tracks field refs
2. **User Input** → Direct DOM manipulation
3. **Change Event** → FormEngine updates internal state
4. **Validation** → Async validation on demand
5. **State Update** → Event-driven React re-render
6. **Form Submission** → Validation and data collection

## 🎨 Benefits

### Performance
- **Minimal re-renders** - only when form state changes
- **Direct DOM access** - no virtual DOM overhead
- **Efficient validation** - only validate changed fields
- **Memory optimized** - automatic cleanup

### Developer Experience
- **TypeScript-first** - full type safety
- **Familiar API** - similar to React Hook Form
- **Built-in validation** - common rules included
- **Easy integration** - drop-in replacement

### Scalability
- **Large forms** - handles thousands of fields
- **Complex validation** - async and custom rules
- **Field arrays** - dynamic field management
- **Nested objects** - deep path support

## 🔮 Future Enhancements

- **Field Arrays** - dynamic field management
- **Advanced Validation** - schema validation
- **Form Persistence** - local storage integration
- **DevTools** - debugging and profiling
- **Performance Monitoring** - metrics and analytics
