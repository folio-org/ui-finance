/**
 * Cache Service - External caching logic
 * Can be injected into FormEngine for custom caching behavior
 */

import { hashFormState } from '../../utils/hash';

export class CacheService {
  constructor(options = {}) {
    this.options = {
      enableValueCache: true,
      enableFormStateCache: true,
      maxCacheSize: 1000,
      ...options,
    };

    // Initialize caches
    this.valueCache = this.options.enableValueCache ? new WeakMap() : null;
    this.formStateCache = this.options.enableFormStateCache ? new WeakMap() : null;

    // Cache statistics
    this.stats = {
      hits: 0,
      misses: 0,
      size: 0,
    };
  }

  /**
   * Get cached value
   * @param {string} key - Cache key
   * @param {Function} computeFn - Function to compute value if not cached
   * @returns {*} Cached or computed value
   */
  getValue(key, computeFn) {
    if (!this.valueCache) {
      return computeFn();
    }

    const cachedValue = this.valueCache.get(key);

    if (cachedValue !== undefined) {
      this.stats.hits++;

      return cachedValue;
    }

    this.stats.misses++;
    const value = computeFn();

    this.valueCache.set(key, value);
    this.stats.size++;

    return value;
  }

  /**
   * Get cached form state
   * @param {Object} formState - Form state object
   * @param {Function} computeFn - Function to compute state if not cached
   * @returns {Object} Cached or computed form state
   */
  getFormState(formState, computeFn) {
    if (!this.formStateCache) {
      return computeFn();
    }

    const cacheKey = hashFormState(formState);

    const cachedFormState = this.formStateCache.get(cacheKey);

    if (cachedFormState !== undefined) {
      this.stats.hits++;

      return cachedFormState;
    }

    this.stats.misses++;
    const computedState = computeFn();

    this.formStateCache.set(cacheKey, computedState);
    this.stats.size++;

    return computedState;
  }

  /**
   * Clear cache for specific path
   * @param {string} path - Field path
   */
  clearForPath(_path) {
    if (!this.valueCache) return;

    // In a real implementation, you'd track which cache entries
    // are affected by which paths for more precise clearing
    this.valueCache = new WeakMap();
    this.stats.size = 0;
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getStats() {
    const total = this.stats.hits + this.stats.misses;

    return {
      ...this.stats,
      hitRate: total > 0 ? ((this.stats.hits / total) * 100).toFixed(2) + '%' : '0%',
    };
  }

  /**
   * Create cache key for value
   * @param {string} path - Field path
   * @param {Object} values - Form values
   * @returns {Object} Cache key
   */
  createValueKey(path, values) {
    return { path, values };
  }

  /**
   * Create cache key for form state
   * @param {Object} formState - Form state
   * @returns {string} Cache key
   */
  createFormStateKey(formState) {
    return hashFormState(formState);
  }
}
