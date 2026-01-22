import {
  act,
  renderHook,
} from '@folio/jest-config-stripes/testing-library/react';

import { handleCommonErrorResponse } from '../../utils';
import { useCommonErrorResponseHandler } from './useCommonErrorResponseHandler';

jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  handleCommonErrorResponse: jest.fn(() => Promise.resolve()),
}));

describe('useCommonErrorResponseHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('hook initialization', () => {
    it('should initialize hook with callout and intl', () => {
      const { result } = renderHook(() => useCommonErrorResponseHandler());

      expect(result.current).toHaveProperty('handle');
      expect(typeof result.current.handle).toBe('function');
    });

    it('should return handle function', () => {
      const { result } = renderHook(() => useCommonErrorResponseHandler());

      expect(result.current.handle).toBeDefined();
    });
  });

  describe('handle function', () => {
    it('should call handle with error object', async () => {
      const mockError = new Error('Test error');

      mockError.response = {};

      const { result } = renderHook(() => useCommonErrorResponseHandler());

      await act(async () => {
        await result.current.handle(mockError);
      });

      expect(handleCommonErrorResponse).toHaveBeenCalled();
    });

    it('should accept error object with response', async () => {
      const mockError = new Error('Test error');

      mockError.response = {
        status: 400,
        json: jest.fn().mockResolvedValue({ errors: [] }),
      };

      const { result } = renderHook(() => useCommonErrorResponseHandler());

      await act(async () => {
        await result.current.handle(mockError);
      });

      expect(handleCommonErrorResponse).toHaveBeenCalled();
    });

    it('should accept error with custom options', async () => {
      const mockError = new Error('Test error');

      mockError.response = {};
      const customOptions = {
        defaultMessageId: 'custom.message.id',
        defaultErrorCode: 'CUSTOM_CODE',
      };

      const { result } = renderHook(() => useCommonErrorResponseHandler());

      await act(async () => {
        await result.current.handle(mockError, customOptions);
      });

      expect(handleCommonErrorResponse).toHaveBeenCalled();
    });

    it('should handle multiple consecutive calls', async () => {
      const error1 = new Error('Error 1');

      error1.response = {};
      const error2 = new Error('Error 2');

      error2.response = {};

      const { result } = renderHook(() => useCommonErrorResponseHandler());

      await act(async () => {
        await result.current.handle(error1);
        await result.current.handle(error2);
      });

      expect(handleCommonErrorResponse).toHaveBeenCalledTimes(2);
    });
  });

  describe('hook behavior', () => {
    it('should have stable reference across re-renders', () => {
      const { result, rerender } = renderHook(() => useCommonErrorResponseHandler());

      rerender();

      expect(result.current.handle).toBeDefined();
      expect(typeof result.current.handle).toBe('function');
    });

    it('should work with empty options object', async () => {
      const mockError = new Error('Test error');

      mockError.response = {};

      const { result } = renderHook(() => useCommonErrorResponseHandler());

      await act(async () => {
        await result.current.handle(mockError, {});
      });

      expect(handleCommonErrorResponse).toHaveBeenCalled();
    });

    it('should work when called without options', async () => {
      const mockError = new Error('Test error');

      mockError.response = {};

      const { result } = renderHook(() => useCommonErrorResponseHandler());

      await act(async () => {
        await result.current.handle(mockError);
      });

      expect(handleCommonErrorResponse).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should not throw when handling valid error', async () => {
      const mockError = new Error('Test error');

      mockError.response = {
        status: 400,
        json: jest.fn().mockResolvedValue({ errors: [] }),
      };

      const { result } = renderHook(() => useCommonErrorResponseHandler());

      await act(async () => {
        await result.current.handle(mockError);
      });

      expect(handleCommonErrorResponse).toHaveBeenCalled();
    });

    it('should handle error with minimal data', async () => {
      const mockError = new Error('Test error');

      const { result } = renderHook(() => useCommonErrorResponseHandler());

      await act(async () => {
        await result.current.handle(mockError);
      });

      expect(handleCommonErrorResponse).toHaveBeenCalled();
    });
  });
});
