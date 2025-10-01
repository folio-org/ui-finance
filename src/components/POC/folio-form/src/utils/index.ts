/**
 * Folio Form - Utility functions
 */

import { FieldValues, FieldPath, FieldPathValue } from '../types';

// ============================================================================
// OBJECT UTILITIES
// ============================================================================

/**
 * Get value by path from object
 */
export function getByPath<T extends FieldValues>(
  obj: T,
  path: string
): FieldPathValue<T, FieldPath<T>> | undefined {
  if (!path || !obj) return undefined;
  
  const keys = path.split('.');
  let current: any = obj;
  
  for (const key of keys) {
    if (current == null) return undefined;
    
    if (key.includes('[') && key.includes(']')) {
      // Handle array notation like 'items[0]'
      const arrayKey = key.substring(0, key.indexOf('['));
      const index = parseInt(key.substring(key.indexOf('[') + 1, key.indexOf(']')), 10);
      
      if (arrayKey) {
        current = current[arrayKey];
        if (current == null) return undefined;
      }
      
      if (!Array.isArray(current)) return undefined;
      current = current[index];
    } else {
      current = current[key];
    }
  }
  
  return current;
}

/**
 * Set value by path in object
 */
export function setByPath<T extends FieldValues>(
  obj: T,
  path: string,
  value: any
): void {
  if (!path || !obj) return;
  
  const keys = path.split('.');
  let current: any = obj;
  
  // Navigate to parent
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    current = navigateToKey(current, key);
    if (!current) return;
  }
  
  // Set final value
  setFinalValue(current, keys[keys.length - 1], value);
}

/**
 * Navigate to a key, creating objects/arrays as needed
 */
function navigateToKey(current: any, key: string): any {
  if (key.includes('[') && key.includes(']')) {
    return navigateToArrayKey(current, key);
  }
  return navigateToObjectKey(current, key);
}

/**
 * Navigate to array key
 */
function navigateToArrayKey(current: any, key: string): any {
  const arrayKey = key.substring(0, key.indexOf('['));
  const index = parseInt(key.substring(key.indexOf('[') + 1, key.indexOf(']')), 10);
  
  let arrayObj = current;
  
  if (arrayKey) {
    if (!(arrayKey in current)) {
      current[arrayKey] = [];
    }
    arrayObj = current[arrayKey];
  }
  
  if (!Array.isArray(arrayObj)) return null;
  
  if (index >= arrayObj.length) {
    while (arrayObj.length <= index) {
      arrayObj.push(undefined);
    }
  }
  
  if (arrayObj[index] == null) {
    arrayObj[index] = {};
  }
  
  return arrayObj[index];
}

/**
 * Navigate to object key
 */
function navigateToObjectKey(current: any, key: string): any {
  if (!(key in current)) {
    current[key] = {};
  }
  return current[key];
}

/**
 * Set final value
 */
function setFinalValue(current: any, key: string, value: any): void {
  if (key.includes('[') && key.includes(']')) {
    setArrayValue(current, key, value);
  } else {
    current[key] = value;
  }
}

/**
 * Set array value
 */
function setArrayValue(current: any, key: string, value: any): void {
  const arrayKey = key.substring(0, key.indexOf('['));
  const index = parseInt(key.substring(key.indexOf('[') + 1, key.indexOf(']')), 10);
  
  let arrayObj = current;
  
  if (arrayKey) {
    if (!(arrayKey in current)) {
      current[arrayKey] = [];
    }
    arrayObj = current[arrayKey];
  }
  
  if (!Array.isArray(arrayObj)) return;
  
  if (index >= arrayObj.length) {
    while (arrayObj.length <= index) {
      arrayObj.push(undefined);
    }
  }
  
  arrayObj[index] = value;
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Deep equality check
 */
export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;
  
  if (typeof a === 'object') {
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    
    if (Array.isArray(a)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (!deepEqual(a[i], b[i])) return false;
      }
      return true;
    }
    
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    
    if (keysA.length !== keysB.length) return false;
    
    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!deepEqual(a[key], b[key])) return false;
    }
    
    return true;
  }
  
  return false;
}

/**
 * Check if value is empty
 */
export function isEmpty(value: any): boolean {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// ============================================================================
// FORM UTILITIES
// ============================================================================

/**
 * Get all form values
 */
export function getFormValues<T extends FieldValues>(
  refs: Map<string, RefObject<HTMLElement>>,
  defaultValues: Partial<T> = {}
): T {
  const values: any = { ...defaultValues };
  
  for (const [name, ref] of refs) {
    if (ref.current) {
      const element = ref.current as any;
      let value: any;
      
      if (element.type === 'checkbox') {
        value = element.checked;
      } else if (element.type === 'radio') {
        value = element.checked ? element.value : undefined;
      } else if (element.type === 'file') {
        value = element.files;
      } else {
        value = element.value;
      }
      
      if (value !== undefined) {
        setByPath(values, name, value);
      }
    }
  }
  
  return values as T;
}

/**
 * Set form values
 */
export function setFormValues<T extends FieldValues>(
  refs: Map<string, RefObject<HTMLElement>>,
  values: Partial<T>
): void {
  for (const [name, ref] of refs) {
    if (ref.current) {
      const element = ref.current as any;
      const value = getByPath(values, name);
      
      if (value !== undefined) {
        if (element.type === 'checkbox' || element.type === 'radio') {
          element.checked = Boolean(value);
        } else {
          element.value = value;
        }
      }
    }
  }
}

/**
 * Clear form values
 */
export function clearFormValues(refs: Map<string, RefObject<HTMLElement>>): void {
  for (const [, ref] of refs) {
    if (ref.current) {
      const element = ref.current as any;
      
      if (element.type === 'checkbox' || element.type === 'radio') {
        element.checked = false;
      } else if (element.type === 'file') {
        element.value = '';
      } else {
        element.value = '';
      }
    }
  }
}
