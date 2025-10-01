/**
 * Folio Form - Utility functions
 */

// ============================================================================
// OBJECT UTILITIES
// ============================================================================

/**
 * Navigate to a key, creating objects/arrays as needed
 */
function navigateToKey(current, key) {
  if (key.includes('[') && key.includes(']')) {
    return navigateToArrayKey(current, key);
  }

  return navigateToObjectKey(current, key);
}

/**
 * Navigate to array key
 */
function navigateToArrayKey(current, key) {
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
function navigateToObjectKey(current, key) {
  if (!(key in current)) {
    current[key] = {};
  }

  return current[key];
}

/**
 * Set final value
 */
function setFinalValue(current, key, value) {
  if (key.includes('[') && key.includes(']')) {
    setArrayValue(current, key, value);
  } else {
    current[key] = value;
  }
}

/**
 * Set array value
 */
function setArrayValue(current, key, value) {
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

/**
 * Get value by path from object
 */
export function getByPath(obj, path) {
  if (!path || !obj) return undefined;

  const keys = path.split('.');
  let current = obj;

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
export function setByPath(obj, path, value) {
  if (!path || !obj) return;

  const keys = path.split('.');
  let current = obj;

  // Navigate to parent
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    current = navigateToKey(current, key);
    if (!current) return;
  }

  // Set final value
  setFinalValue(current, keys[keys.length - 1], value);
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Deep equality check
 */
export function deepEqual(a, b) {
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
export function isEmpty(value) {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;

  return false;
}

/**
 * Generate unique ID
 */
export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// ============================================================================
// FORM UTILITIES
// ============================================================================

/**
 * Get all form values
 */
export function getFormValues(refs, defaultValues = {}) {
  const values = { ...defaultValues };

  for (const [name, ref] of refs) {
    if (ref.current) {
      const element = ref.current;
      let value;

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

  return values;
}

/**
 * Set form values
 */
export function setFormValues(refs, values) {
  for (const [name, ref] of refs) {
    if (ref.current) {
      const element = ref.current;
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
export function clearFormValues(refs) {
  for (const [, ref] of refs) {
    if (ref.current) {
      const element = ref.current;

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
