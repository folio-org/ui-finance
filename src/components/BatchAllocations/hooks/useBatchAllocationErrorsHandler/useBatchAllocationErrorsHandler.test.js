import { useIntl } from 'react-intl';

import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useShowCallout } from '@folio/stripes-acq-components';

import { handleBatchAllocationResponseError } from '../../handleBatchAllocationResponseError';
import { useBatchAllocationErrorsHandler } from './useBatchAllocationErrorsHandler';

jest.mock('@folio/stripes-acq-components', () => ({
  useShowCallout: jest.fn(),
}));
jest.mock('react-intl', () => ({
  useIntl: jest.fn(),
}));
jest.mock('../../handleBatchAllocationResponseError', () => ({
  handleBatchAllocationResponseError: jest.fn(),
}));

describe('useBatchAllocationErrorsHandler', () => {
  const showCalloutMock = jest.fn();
  const formatMessageMock = jest.fn();
  const intlMock = { formatMessage: formatMessageMock };

  beforeEach(() => {
    useShowCallout.mockReturnValue(showCalloutMock);
    useIntl.mockReturnValue(intlMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls handleBatchAllocationResponseError when error.response is present', () => {
    const error = { response: { status: 400 } };
    const expectedResult = 'handled';

    handleBatchAllocationResponseError.mockReturnValue(expectedResult);

    const { result } = renderHook(() => useBatchAllocationErrorsHandler());
    const res = result.current.handle(error);

    expect(handleBatchAllocationResponseError).toHaveBeenCalledWith(error.response, showCalloutMock, intlMock);
    expect(res).toBe(expectedResult);
  });

  it('calls showCallout with error.message if present', () => {
    const error = { message: 'Something went wrong' };
    const { result } = renderHook(() => useBatchAllocationErrorsHandler());

    result.current.handle(error);

    expect(showCalloutMock).toHaveBeenCalledWith({
      message: 'Something went wrong',
      type: 'error',
    });
  });

  it('calls showCallout with default intl message if no message', () => {
    const error = {};

    formatMessageMock.mockReturnValue('Default error message');
    const { result } = renderHook(() => useBatchAllocationErrorsHandler());

    result.current.handle(error);

    expect(formatMessageMock).toHaveBeenCalledWith({ id: 'ui-finance.actions.allocations.batch.error' });
    expect(showCalloutMock).toHaveBeenCalledWith({
      message: 'Default error message',
      type: 'error',
    });
  });
});
