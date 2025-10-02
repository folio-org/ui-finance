/**
 * Tests for FormWire validation utilities
 */

import { handleValidation, createDebouncedValidator, validateField } from '../utils/validation.js';
import FormEngine from '../core/FormEngine.js';

describe('Validation Utilities', () => {
  let engine;
  
  beforeEach(() => {
    engine = new FormEngine();
  });
  
  describe('handleValidation', () => {
    it('should handle sync validation with error', async () => {
      await handleValidation('Error message', engine, 'testField');
      expect(engine.getErrors().testField).toBe('Error message');
    });
    
    it('should handle sync validation without error', async () => {
      await handleValidation(null, engine, 'testField');
      expect(engine.getErrors().testField).toBeUndefined();
    });
    
    it('should handle async validation with error', async () => {
      const asyncValidator = Promise.resolve('Async error');
      await handleValidation(asyncValidator, engine, 'testField');
      expect(engine.getErrors().testField).toBe('Async error');
    });
    
    it('should handle async validation rejection', async () => {
      const asyncValidator = Promise.reject(new Error('Validation failed'));
      await handleValidation(asyncValidator, engine, 'testField');
      expect(engine.getErrors().testField).toBe('Validation failed');
    });
  });
  
  describe('createDebouncedValidator', () => {
    it('should create debounced validator', () => {
      const validator = jest.fn().mockResolvedValue(null);
      const debouncedValidator = createDebouncedValidator(validator, engine, 'testField', 100);
      
      expect(typeof debouncedValidator).toBe('function');
    });
    
    it('should debounce validation calls', (done) => {
      const validator = jest.fn().mockResolvedValue(null);
      const debouncedValidator = createDebouncedValidator(validator, engine, 'testField', 50);
      
      debouncedValidator('value1', {});
      debouncedValidator('value2', {});
      debouncedValidator('value3', {});
      
      setTimeout(() => {
        expect(validator).toHaveBeenCalledTimes(1);
        expect(validator).toHaveBeenCalledWith('value3', {});
        done();
      }, 100);
    });
  });
  
  describe('validateField', () => {
    it('should validate field with sync validator', async () => {
      const validator = jest.fn().mockReturnValue('Sync error');
      await validateField(validator, 'test', {}, engine, 'testField');
      
      expect(validator).toHaveBeenCalledWith('test', {});
      expect(engine.getErrors().testField).toBe('Sync error');
    });
    
    it('should validate field with async validator', async () => {
      const validator = jest.fn().mockResolvedValue('Async error');
      await validateField(validator, 'test', {}, engine, 'testField');
      
      expect(validator).toHaveBeenCalledWith('test', {});
      expect(engine.getErrors().testField).toBe('Async error');
    });
    
    it('should handle validator errors', async () => {
      const validator = jest.fn().mockRejectedValue(new Error('Validator error'));
      await validateField(validator, 'test', {}, engine, 'testField');
      
      expect(engine.getErrors().testField).toBe('Validator error');
    });
  });
});

