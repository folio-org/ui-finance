import { handleBatchAllocationResponseError } from './handleBatchAllocationResponseError';

describe('handleBatchAllocationResponseError', () => {
  const intl = {
    formatMessage: jest.fn(({ id }) => id),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('basic functionality', () => {
    it('should handle error response successfully', async () => {
      const response = {
        status: 400,
        clone: () => response,
        json: () => Promise.resolve({
          errors: [
            {
              code: 'TEST_ERROR',
              message: 'Test error message',
            },
          ],
        }),
      };

      const sendCallout = () => {};

      await expect(handleBatchAllocationResponseError(response, sendCallout, intl)).resolves.toBeUndefined();
    });

    it('should handle response with different status codes', async () => {
      const statusCodes = [400, 401, 403, 404, 500, 502, 503];

      for (const status of statusCodes) {
        const response = {
          status,
          clone: () => response,
          json: () => Promise.resolve({
            errors: [{ code: 'ERROR', message: 'Error' }],
          }),
        };

        const sendCallout = () => {};

        await expect(handleBatchAllocationResponseError(response, sendCallout, intl)).resolves.toBeUndefined();
      }
    });

    it('should handle response with multiple errors', async () => {
      const response = {
        status: 400,
        clone: () => response,
        json: () => Promise.resolve({
          errors: [
            { code: 'ERROR_1', message: 'First error' },
            { code: 'ERROR_2', message: 'Second error' },
            { code: 'ERROR_3', message: 'Third error' },
          ],
        }),
      };

      const sendCallout = () => {};

      await expect(handleBatchAllocationResponseError(response, sendCallout, intl)).resolves.toBeUndefined();
    });
  });

  describe('error scenarios', () => {
    it('should handle response without errors array', async () => {
      const response = {
        status: 500,
        clone: () => response,
        json: () => Promise.resolve({}),
      };

      const sendCallout = () => {};

      await expect(handleBatchAllocationResponseError(response, sendCallout, intl)).resolves.toBeUndefined();
    });

    it('should handle response with empty errors array', async () => {
      const response = {
        status: 400,
        json: () => Promise.resolve({ errors: [] }),
      };

      const sendCallout = () => {};

      await expect(handleBatchAllocationResponseError(response, sendCallout, intl)).resolves.toBeUndefined();
    });
  });
});
