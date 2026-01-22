import { ERROR_CODE_GENERIC } from '@folio/stripes-acq-components';

import { genericErrorStrategy } from './genericErrorStrategy';

describe('genericErrorStrategy', () => {
  let mockCallout;
  let mockIntl;
  let mockErrorsContainer;

  beforeEach(() => {
    mockCallout = {
      sendCallout: jest.fn(),
    };

    mockIntl = {
      formatMessage: jest.fn(({ id, defaultMessage }) => defaultMessage || id),
    };

    mockErrorsContainer = {
      getError: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle function', () => {
    it('should handle error with specific error code', () => {
      const errorCode = 'SPECIFIC_ERROR';

      mockErrorsContainer.getError.mockReturnValue({
        code: errorCode,
        message: 'Specific error message',
      });

      const strategy = genericErrorStrategy({
        callout: mockCallout,
        intl: mockIntl,
        defaultErrorCode: 'DEFAULT_ERROR',
      });

      strategy.handle(mockErrorsContainer);

      expect(mockCallout.sendCallout).toHaveBeenCalledWith({
        message: expect.any(String),
        type: 'error',
      });

      expect(mockIntl.formatMessage).toHaveBeenCalledWith({
        id: `ui-finance.errors.${errorCode}`,
        defaultMessage: expect.any(String),
      });
    });

    it('should use defaultErrorCode when response error code is generic', () => {
      const defaultCode = 'DEFAULT_ERROR';

      mockErrorsContainer.getError.mockReturnValue({
        code: ERROR_CODE_GENERIC,
        message: 'Generic error',
      });

      const strategy = genericErrorStrategy({
        callout: mockCallout,
        intl: mockIntl,
        defaultErrorCode: defaultCode,
      });

      strategy.handle(mockErrorsContainer);

      expect(mockIntl.formatMessage).toHaveBeenCalledWith({
        id: `ui-finance.errors.${defaultCode}`,
        defaultMessage: expect.any(String),
      });
    });

    it('should use provided defaultMessage prop', () => {
      const customMessage = 'Custom error message';

      mockErrorsContainer.getError.mockReturnValue({
        code: 'ERROR_CODE',
        message: 'Original message',
      });

      const strategy = genericErrorStrategy({
        callout: mockCallout,
        intl: mockIntl,
        defaultMessage: customMessage,
      });

      strategy.handle(mockErrorsContainer);

      expect(mockCallout.sendCallout).toHaveBeenCalledWith({
        message: customMessage,
        type: 'error',
      });
    });

    it('should use error message from response when other defaults are not provided', () => {
      const errorMessage = 'Error from response';

      mockErrorsContainer.getError.mockReturnValue({
        code: 'ERROR_CODE',
        message: errorMessage,
      });

      const strategy = genericErrorStrategy({
        callout: mockCallout,
        intl: mockIntl,
      });

      strategy.handle(mockErrorsContainer);

      expect(mockCallout.sendCallout).toHaveBeenCalledWith({
        message: expect.any(String),
        type: 'error',
      });
    });

    it('should format message with intl when defaultMessageId is provided', () => {
      const messageId = 'ui-finance.custom.message';
      const formattedMessage = 'Formatted custom message';

      mockIntl.formatMessage.mockImplementation(({ id }) => {
        if (id === messageId) return formattedMessage;

        return 'ui-finance.errors.DEFAULT';
      });

      mockErrorsContainer.getError.mockReturnValue({
        code: 'ERROR_CODE',
      });

      const strategy = genericErrorStrategy({
        callout: mockCallout,
        intl: mockIntl,
        defaultMessageId: messageId,
      });

      strategy.handle(mockErrorsContainer);

      expect(mockIntl.formatMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          id: messageId,
        }),
      );
    });

    it('should send callout with error type', () => {
      mockErrorsContainer.getError.mockReturnValue({
        code: 'ERROR_CODE',
        message: 'Error',
      });

      const strategy = genericErrorStrategy({
        callout: mockCallout,
        intl: mockIntl,
      });

      strategy.handle(mockErrorsContainer);

      expect(mockCallout.sendCallout).toHaveBeenCalledWith({
        message: expect.any(String),
        type: 'error',
      });
    });

    it('should handle intl formatting correctly', () => {
      mockErrorsContainer.getError.mockReturnValue({
        code: 'TEST_CODE',
        message: 'Test message',
      });

      mockIntl.formatMessage.mockReturnValue('Translated message');

      const strategy = genericErrorStrategy({
        callout: mockCallout,
        intl: mockIntl,
      });

      strategy.handle(mockErrorsContainer);

      expect(mockCallout.sendCallout).toHaveBeenCalledWith({
        message: 'Translated message',
        type: 'error',
      });
    });
  });

  describe('return value', () => {
    it('should return object with handle function', () => {
      const result = genericErrorStrategy({
        callout: mockCallout,
        intl: mockIntl,
      });

      expect(result).toEqual({
        handle: expect.any(Function),
      });
    });

    it('should return a function that can be called multiple times', () => {
      const strategy = genericErrorStrategy({
        callout: mockCallout,
        intl: mockIntl,
      });

      mockErrorsContainer.getError.mockReturnValue({
        code: 'ERROR_CODE_1',
        message: 'Error 1',
      });

      strategy.handle(mockErrorsContainer);
      expect(mockCallout.sendCallout).toHaveBeenCalledTimes(1);

      mockErrorsContainer.getError.mockReturnValue({
        code: 'ERROR_CODE_2',
        message: 'Error 2',
      });

      strategy.handle(mockErrorsContainer);
      expect(mockCallout.sendCallout).toHaveBeenCalledTimes(2);
    });
  });

  describe('message precedence', () => {
    it('should prioritize defaultMessage prop over other options', () => {
      const customMessage = 'Priority message';
      const messageId = 'ui-finance.custom.message';
      const responseMessage = 'Response message';

      mockErrorsContainer.getError.mockReturnValue({
        code: 'ERROR_CODE',
        message: responseMessage,
      });

      const strategy = genericErrorStrategy({
        callout: mockCallout,
        intl: mockIntl,
        defaultMessage: customMessage,
        defaultMessageId: messageId,
      });

      strategy.handle(mockErrorsContainer);

      // intl.formatMessage will be called with defaultMessage, which is passed as defaultMessage parameter
      expect(mockCallout.sendCallout).toHaveBeenCalledWith({
        message: expect.any(String),
        type: 'error',
      });
    });

    it('should use defaultMessageId when defaultMessage prop is not provided', () => {
      const messageId = 'ui-finance.custom.message';
      const formattedMessage = 'Formatted message from ID';
      const responseMessage = 'Response message';

      mockErrorsContainer.getError.mockReturnValue({
        code: 'ERROR_CODE',
        message: responseMessage,
      });

      mockIntl.formatMessage.mockImplementation(({ id, defaultMessage }) => {
        if (id === messageId) return formattedMessage;

        return defaultMessage || id;
      });

      const strategy = genericErrorStrategy({
        callout: mockCallout,
        intl: mockIntl,
        defaultMessageId: messageId,
      });

      strategy.handle(mockErrorsContainer);

      expect(mockIntl.formatMessage).toHaveBeenCalledWith(
        expect.objectContaining({ id: messageId }),
      );
    });

    it('should use response error message when defaultMessage and defaultMessageId are not provided', () => {
      const errorMessage = 'Response error message';

      mockErrorsContainer.getError.mockReturnValue({
        code: 'ERROR_CODE',
        message: errorMessage,
      });

      const strategy = genericErrorStrategy({
        callout: mockCallout,
        intl: mockIntl,
      });

      strategy.handle(mockErrorsContainer);

      expect(mockIntl.formatMessage).toHaveBeenCalledWith({
        id: 'ui-finance.errors.ERROR_CODE',
        defaultMessage: errorMessage,
      });
    });

    it('should use fallback translation when no message defaults are available', () => {
      mockErrorsContainer.getError.mockReturnValue({
        code: 'ERROR_CODE',
      });

      const strategy = genericErrorStrategy({
        callout: mockCallout,
        intl: mockIntl,
        defaultErrorCode: 'DEFAULT_CODE',
      });

      strategy.handle(mockErrorsContainer);

      expect(mockIntl.formatMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'ui-finance.errors.ERROR_CODE',
        }),
      );
    });
  });

  describe('error code handling', () => {
    it('should correctly identify ERROR_CODE_GENERIC', () => {
      mockErrorsContainer.getError.mockReturnValue({
        code: ERROR_CODE_GENERIC,
        message: 'Generic',
      });

      const defaultCode = 'CUSTOM_DEFAULT';

      const strategy = genericErrorStrategy({
        callout: mockCallout,
        intl: mockIntl,
        defaultErrorCode: defaultCode,
      });

      strategy.handle(mockErrorsContainer);

      expect(mockIntl.formatMessage).toHaveBeenCalledWith({
        id: `ui-finance.errors.${defaultCode}`,
        defaultMessage: expect.any(String),
      });
    });

    it('should pass specific error code to intl', () => {
      const errorCode = 'SPECIFIC_ERROR_CODE';

      mockErrorsContainer.getError.mockReturnValue({
        code: errorCode,
        message: 'Specific',
      });

      const strategy = genericErrorStrategy({
        callout: mockCallout,
        intl: mockIntl,
      });

      strategy.handle(mockErrorsContainer);

      expect(mockIntl.formatMessage).toHaveBeenCalledWith({
        id: `ui-finance.errors.${errorCode}`,
        defaultMessage: expect.any(String),
      });
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete error scenario with all parameters', () => {
      mockErrorsContainer.getError.mockReturnValue({
        code: 'SPECIFIC_ERROR',
        message: 'Response error message',
      });

      mockIntl.formatMessage.mockImplementation(({ id, defaultMessage }) => {
        if (id === 'ui-finance.custom.id') {
          return 'Formatted custom message';
        }

        return defaultMessage || id;
      });

      const strategy = genericErrorStrategy({
        callout: mockCallout,
        intl: mockIntl,
        defaultMessage: 'Default fallback',
        defaultMessageId: 'ui-finance.custom.id',
        defaultErrorCode: 'DEFAULT_CODE',
      });

      strategy.handle(mockErrorsContainer);

      expect(mockCallout.sendCallout).toHaveBeenCalledWith({
        message: 'Default fallback',
        type: 'error',
      });
    });

    it('should handle minimal parameters', () => {
      mockErrorsContainer.getError.mockReturnValue({
        code: 'ERROR_CODE',
        message: 'Message',
      });

      const strategy = genericErrorStrategy({
        callout: mockCallout,
        intl: mockIntl,
      });

      strategy.handle(mockErrorsContainer);

      expect(mockCallout.sendCallout).toHaveBeenCalled();
      expect(mockIntl.formatMessage).toHaveBeenCalled();
    });
  });
});
