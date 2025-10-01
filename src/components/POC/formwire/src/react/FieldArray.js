/**
 * FieldArray component - For managing arrays of fields
 */

import React, { useMemo } from 'react';
import { useFormEngine } from './FormContext.js';
import { useWatch } from './hooks.js';

export default function FieldArray({ name, children }) {
  const engine = useFormEngine();
  
  // Watch array changes
  const array = useWatch(name, (value) => value || []);
  
  // Generate field descriptors
  const fields = useMemo(() => {
    return array.map((_, index) => ({
      name: `${name}[${index}]`,
      __id: `${name}[${index}]`,
      index,
    }));
  }, [name, array]);

  // Array manipulation methods
  const arrayMethods = useMemo(() => ({
    push: (item) => {
      const currentArray = engine.get(name) || [];
      engine.set(name, [...currentArray, item]);
    },
    
    remove: (index) => {
      const currentArray = engine.get(name) || [];
      const newArray = currentArray.filter((_, i) => i !== index);
      engine.set(name, newArray);
    },
    
  }), [engine, name]);

  // Render with children function
  if (typeof children === 'function') {
    return children({ fields, ...arrayMethods });
  }

  // Default render
  return (
    <div>
      {fields.map((field) => (
        <div key={field.__id}>
          {children}
        </div>
      ))}
    </div>
  );
}
