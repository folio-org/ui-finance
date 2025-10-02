/**
 * Tests for FormWire hash utilities
 */

import { hashObject, hashObjectShallow, hashFormState } from '../utils/hash.js';

describe('Hash Utilities', () => {
  describe('hashObject', () => {
    it('should hash simple objects', () => {
      const obj = { a: 1, b: 2 };
      const hash = hashObject(obj);
      expect(typeof hash).toBe('string');
      expect(hash).toContain('a:1');
      expect(hash).toContain('b:2');
    });
    
    it('should hash nested objects', () => {
      const obj = { a: { b: { c: 3 } } };
      const hash = hashObject(obj);
      expect(typeof hash).toBe('string');
      expect(hash).toContain('c:3');
    });
    
    it('should hash arrays', () => {
      const obj = [1, 2, 3];
      const hash = hashObject(obj);
      expect(hash).toBe('[1,2,3]');
    });
    
    it('should hash null and undefined', () => {
      expect(hashObject(null)).toBe('null');
      expect(hashObject(undefined)).toBe('null');
    });
    
    it('should hash primitives', () => {
      expect(hashObject(42)).toBe('42');
      expect(hashObject('hello')).toBe('hello');
      expect(hashObject(true)).toBe('true');
    });
  });
  
  describe('hashObjectShallow', () => {
    it('should hash only first level', () => {
      const obj = { a: 1, b: { c: 2 } };
      const hash = hashObjectShallow(obj);
      expect(hash).toContain('a:1');
      expect(hash).toContain('b:[object Object]');
    });
    
    it('should be faster than deep hash for simple objects', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const deepHash = hashObject(obj);
      const shallowHash = hashObjectShallow(obj);
      
      expect(typeof deepHash).toBe('string');
      expect(typeof shallowHash).toBe('string');
      expect(deepHash).not.toBe(shallowHash);
    });
  });
  
  describe('hashFormState', () => {
    it('should hash form state correctly', () => {
      const formState = {
        values: { name: 'John', email: 'john@example.com' },
        errors: { name: 'Required' },
        touched: ['name'],
        active: 'email',
        submitting: false
      };
      
      const hash = hashFormState(formState);
      expect(typeof hash).toBe('string');
      expect(hash).toContain('name:John');
      expect(hash).toContain('email:john@example.com');
      expect(hash).toContain('name:Required');
      expect(hash).toContain('name');
      expect(hash).toContain('email');
      expect(hash).toContain('false');
    });
    
    it('should produce consistent hashes for same input', () => {
      const formState = {
        values: { a: 1 },
        errors: {},
        touched: [],
        active: null,
        submitting: false
      };
      
      const hash1 = hashFormState(formState);
      const hash2 = hashFormState(formState);
      expect(hash1).toBe(hash2);
    });
    
    it('should produce different hashes for different input', () => {
      const formState1 = { values: { a: 1 }, errors: {}, touched: [], active: null, submitting: false };
      const formState2 = { values: { a: 2 }, errors: {}, touched: [], active: null, submitting: false };
      
      const hash1 = hashFormState(formState1);
      const hash2 = hashFormState(formState2);
      expect(hash1).not.toBe(hash2);
    });
  });
});

