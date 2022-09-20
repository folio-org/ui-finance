import { renderHook } from '@testing-library/react-hooks';

import {
  ERROR_CODE_CONFLICT,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { useRolloverErrorHandler } from './useRolloverErrorHandler';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useShowCallout: jest.fn(),
}));

const ledger = {
  name: 'Test ledger',
};
const currentFiscalYear = {
  code: 'FY2022',
};

const getErrorResponse = (code) => ({
  json: () => Promise.resolve({ errors: [{ code }] }),
});

describe('useRolloverErrorHandler', () => {
  const showCallout = jest.fn();

  beforeEach(() => {
    useShowCallout.mockClear().mockReturnValue(showCallout);
  });

  it('should return function that handle generic rollover error', async () => {
    const { result } = renderHook(() => useRolloverErrorHandler({ ledger, currentFiscalYear }));

    await result.current(getErrorResponse('someErrorCode'));

    expect(showCallout).toHaveBeenCalledWith(expect.objectContaining({
      messageId: 'ui-finance.ledger.rollover.errorExecute',
    }));
  });

  it('should return function that handle rollover uniqueness error', async () => {
    const { result } = renderHook(() => useRolloverErrorHandler({ ledger, currentFiscalYear }));

    await result.current(getErrorResponse(ERROR_CODE_CONFLICT));

    expect(showCallout).toHaveBeenCalledWith(expect.objectContaining({
      messageId: 'ui-finance.ledger.rollover.error.conflict',
    }));
  });
});
