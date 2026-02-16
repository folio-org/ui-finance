import {
  createIntl,
  createIntlCache,
} from 'react-intl';

import { handleCommonErrorResponse } from './handleCommonErrorResponse';

describe('handleCommonErrorResponse', () => {
  let mockCallout;
  let intl;

  beforeEach(() => {
    mockCallout = {
      sendCallout: jest.fn(),
    };

    const cache = createIntlCache();

    intl = createIntl({
      locale: 'en',
      messages: {
        'ui-finance.errors.GENERIC': 'An error occurred',
        'ui-finance.errors.TEST_ERROR': 'Test error message',
      },
    }, cache);

    jest.clearAllMocks();
  });

  describe('basic functionality', () => {
    it('should handle error response successfully', async () => {
      const mockResponse = {
        status: 400,
        json: jest.fn().mockResolvedValue({
          errors: [
            {
              code: 'TEST_ERROR',
              message: 'Test error message',
            },
          ],
        }),
      };

      const params = {
        callout: mockCallout,
        intl,
        defaultErrorCode: 'GENERIC',
      };

      await handleCommonErrorResponse({ response: mockResponse }, params);

      expect(mockCallout.sendCallout).toHaveBeenCalled();
    });

    it('should accept params with intl and callout', async () => {
      const mockResponse = {
        status: 500,
        json: jest.fn().mockResolvedValue({
          errors: [{ code: 'GENERIC', message: 'Server error' }],
        }),
      };

      const params = {
        callout: mockCallout,
        intl,
      };

      await handleCommonErrorResponse({ response: mockResponse }, params);

      expect(mockCallout.sendCallout).toHaveBeenCalled();
    });

    it('should accept params with defaultMessage', async () => {
      const mockResponse = {
        status: 400,
        json: jest.fn().mockResolvedValue({
          errors: [{ code: 'TEST_ERROR', message: 'Test error' }],
        }),
      };

      const params = {
        callout: mockCallout,
        intl,
        defaultMessage: 'Custom default message',
      };

      await handleCommonErrorResponse({ response: mockResponse }, params);

      expect(mockCallout.sendCallout).toHaveBeenCalled();
    });

    it('should accept params with defaultMessageId', async () => {
      const mockResponse = {
        status: 400,
        json: jest.fn().mockResolvedValue({
          errors: [{ code: 'TEST_ERROR', message: 'Error' }],
        }),
      };

      const params = {
        callout: mockCallout,
        intl,
        defaultMessageId: 'ui-finance.errors.TEST_ERROR',
      };

      await handleCommonErrorResponse({ response: mockResponse }, params);

      expect(mockCallout.sendCallout).toHaveBeenCalled();
    });
  });

  describe('error scenarios', () => {
    it('should handle different HTTP status codes', async () => {
      const statusCodes = [400, 401, 403, 404, 500, 502, 503];

      for (const status of statusCodes) {
        jest.clearAllMocks();

        const mockResponse = {
          status,
          json: jest.fn().mockResolvedValue({
            errors: [{ code: 'ERROR', message: 'Error' }],
          }),
        };

        await handleCommonErrorResponse({ response: mockResponse }, {
          callout: mockCallout,
          intl,
        });

        expect(mockCallout.sendCallout).toHaveBeenCalled();
      }
    });

    it('should handle response with multiple errors', async () => {
      const mockResponse = {
        status: 400,
        json: jest.fn().mockResolvedValue({
          errors: [
            { code: 'ERROR_1', message: 'First error' },
            { code: 'ERROR_2', message: 'Second error' },
            { code: 'ERROR_3', message: 'Third error' },
          ],
        }),
      };

      const params = {
        callout: mockCallout,
        intl,
      };

      await handleCommonErrorResponse({ response: mockResponse }, params);

      expect(mockCallout.sendCallout).toHaveBeenCalled();
    });
  });

  describe('integration with strategy pattern', () => {
    it('should properly handle error response with real utilities', async () => {
      const mockResponse = {
        status: 400,
        json: jest.fn().mockResolvedValue({
          errors: [{ code: 'TEST_ERROR', message: 'Test' }],
        }),
      };

      const params = {
        callout: mockCallout,
        intl,
        defaultErrorCode: 'GENERIC',
      };

      await handleCommonErrorResponse({ response: mockResponse }, params);

      expect(mockCallout.sendCallout).toHaveBeenCalled();
    });
  });
});
