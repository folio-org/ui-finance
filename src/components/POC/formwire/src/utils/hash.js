/**
 * Fast object hashing utilities
 * Replaces slow JSON.stringify for better performance
 */

/**
 * Create a fast hash of an object
 * Much faster than JSON.stringify for large objects
 * @param {Object} obj - Object to hash
 * @returns {string} Hash string
 */
export const hashObject = (obj) => {
  if (obj === null || obj === undefined) {
    return 'null';
  }

  if (typeof obj !== 'object') {
    return String(obj);
  }

  if (Array.isArray(obj)) {
    return `[${obj.map(hashObject).join(',')}]`;
  }

  // For objects, create a deterministic hash
  const keys = Object.keys(obj).sort();
  const hashParts = keys.map(key => `${key}:${hashObject(obj[key])}`);

  return `{${hashParts.join(',')}}`;
};

/**
 * Create a shallow hash of an object (only first level)
 * Even faster for simple objects
 * @param {Object} obj - Object to hash
 * @returns {string} Shallow hash string
 */
export const hashObjectShallow = (obj) => {
  if (obj === null || obj === undefined) {
    return 'null';
  }

  if (typeof obj !== 'object') {
    return String(obj);
  }

  const keys = Object.keys(obj).sort();
  const hashParts = keys.map(key => `${key}:${obj[key]}`);

  return `{${hashParts.join(',')}}`;
};

/**
 * Create a hash for form state caching
 * Optimized for form state objects
 * @param {Object} formState - Form state object
 * @returns {string} Hash string
 */
export const hashFormState = (formState) => {
  const { values, errors, touched, active, submitting } = formState;

  return [
    hashObjectShallow(values),
    hashObjectShallow(errors),
    Array.isArray(touched) ? touched.join(',') : '[]',
    active || 'null',
    submitting ? 'true' : 'false',
  ].join('|');
};
