import get from 'lodash/get';

import { ResponseErrorsContainer } from '@folio/stripes-acq-components';

import { handleRecalculateError } from './utils';

describe('handleRecalculateError', () => {
  const showCallout = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a map of form errors when parameterized errors are present', async () => {
    const error = {
      response: {
        json: async () => ({
          errors: [
            {
              message: 'Error message 1',
              parameters: [{ key: 'financeData[0].field1' }],
            },
            {
              message: 'Error message 2',
              parameters: [{ key: 'financeData[1].field2' }],
            },
          ],
        }),
      },
    };

    const handler = {
      originalResponseBody: await error.response.json(),
    };

    jest.spyOn(ResponseErrorsContainer, 'create').mockResolvedValue({ handler });

    const result = await handleRecalculateError(error, showCallout);

    expect(get(result, 'fyFinanceData.0.field1')).toEqual('Error message 1');
    expect(get(result, 'fyFinanceData.1.field2')).toEqual('Error message 2');
    expect(showCallout).not.toHaveBeenCalled();
  });

  it('should show a callout error message when non-parameterized errors are present', async () => {
    const error = {
      response: {
        json: async () => ({
          errors: [
            {
              message: 'Non-parameterized error message',
            },
          ],
        }),
      },
    };

    const handler = {
      originalResponseBody: await error.response.json(),
    };

    jest.spyOn(ResponseErrorsContainer, 'create').mockResolvedValue({ handler });

    const result = await handleRecalculateError(error, showCallout);

    expect(Object.values(result).length).toBe(0);
    expect(showCallout).toHaveBeenCalledTimes(1);
    expect(showCallout).toHaveBeenCalledWith({
      message: 'Non-parameterized error message',
      type: 'error',
    });
  });

  it('should show a default callout error message when non-parameterized errors are present without a message', async () => {
    const error = {
      response: {
        json: async () => ({
          errors: [{}],
        }),
      },
    };

    const handler = {
      originalResponseBody: await error.response.json(),
    };

    jest.spyOn(ResponseErrorsContainer, 'create').mockResolvedValue({ handler });

    const result = await handleRecalculateError(error, showCallout);

    expect(Object.values(result).length).toBe(0);
    expect(showCallout).toHaveBeenCalledTimes(1);
    expect(showCallout).toHaveBeenCalledWith({
      messageId: 'ui-finance.allocation.batch.form.recalculate.error',
      type: 'error',
    });
  });
});
