import get from 'lodash/get';
import set from 'lodash/set';
import isEqual from 'lodash/isEqual';

/**
 * Utility helpers: safe get/set and equality.
 */

export const getByPath = (obj, path) => (path ? get(obj, path) : obj);

export const setByPath = (obj, path, value) => {
  if (!path) return;
  set(obj, path, value);
};

export const shallowEqual = (a, b) => {
  if (a === b) return true;
  if (!a || !b) return false;
  const ka = Object.keys(a); const
    kb = Object.keys(b);

  if (ka.length !== kb.length) return false;
  for (const k of ka) if (a[k] !== b[k]) return false;

  return true;
};

export const deepEqual = isEqual;

export const uid = (() => {
  let i = 0;

  return () => (++i).toString();
})();
