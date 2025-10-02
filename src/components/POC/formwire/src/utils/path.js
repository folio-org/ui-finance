/**
 * Path manipulation utilities
 */

/**
 * Parse path into keys array
 * @param {string} path - Dot notation path
 * @returns {Array} Array of keys
 * @private
 */
const parsePath = (path) => {
  if (!path) return [];

  return path.split('.');
};

/**
 * Navigate to path in object
 * @param {Object} obj - Object to navigate
 * @param {Array} keys - Array of keys
 * @param {boolean} createMissing - Whether to create missing objects
 * @returns {Object} Navigation result
 * @private
 */
const navigateToPath = (obj, keys, createMissing = false) => {
  let current = obj;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    if (current == null) {
      if (createMissing) {
        current = {};
      } else {
        return { current: null, found: false };
      }
    }

    if (createMissing && !(key in current)) {
      current[key] = {};
    }

    current = current[key];
  }

  return { current, found: true };
};

/**
 * Get value by path from object
 * @param {Object} obj - Object to get value from
 * @param {string} path - Dot notation path (e.g., 'user.name', 'items[0].title')
 * @returns {*} Value at path
 */
export const getByPath = (obj, path) => {
  if (!path) return obj;

  const keys = parsePath(path);
  const { current } = navigateToPath(obj, keys);

  return current;
};

/**
 * Set value by path in object
 * @param {Object} obj - Object to set value in
 * @param {string} path - Dot notation path
 * @param {*} value - Value to set
 * @returns {Object} Modified object
 */
export const setByPath = (obj, path, value) => {
  if (!path) return obj;

  const keys = parsePath(path);
  const result = { ...obj };
  let current = result;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (current[key] == null) {
      current[key] = {};
    } else {
      current[key] = { ...current[key] };
    }

    current = current[key];
  }

  current[keys[keys.length - 1]] = value;

  return result;
};

/**
 * Check if path exists in object
 * @param {Object} obj - Object to check
 * @param {string} path - Dot notation path
 * @returns {boolean} True if path exists
 */
export const hasPath = (obj, path) => {
  if (!path) return true;

  const keys = parsePath(path);
  const { found } = navigateToPath(obj, keys);

  return found;
};

/**
 * Delete value by path from object
 * @param {Object} obj - Object to delete value from
 * @param {string} path - Dot notation path
 * @returns {Object} Modified object
 */
export const deleteByPath = (obj, path) => {
  if (!path) return obj;

  const keys = parsePath(path);
  const result = { ...obj };
  let current = result;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (current[key] == null) {
      return result; // Path doesn't exist
    }

    current[key] = { ...current[key] };
    current = current[key];
  }

  delete current[keys[keys.length - 1]];

  return result;
};
