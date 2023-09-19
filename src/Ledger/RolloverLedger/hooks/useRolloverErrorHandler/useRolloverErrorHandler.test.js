import { FormattedMessage } from 'react-intl';
import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { useOkapiKy } from '@folio/stripes/core';
import {
  ERROR_CODE_CONFLICT,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  FISCAL_YEARS_API,
  LEDGER_ROLLOVER_API,
} from '../../../../common/const';
import { useRolloverErrorHandler } from './useRolloverErrorHandler';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
}));
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

const kyResponsecMap = {
  [LEDGER_ROLLOVER_API]: {
    ledgerFiscalYearRollovers: [{
      toFiscalYearId: 'toFiscalYearId',
    }],
  },
  [`${FISCAL_YEARS_API}/toFiscalYearId`]: {
    code: 'FY2022',
  },
};

describe('useRolloverErrorHandler', () => {
  const showCallout = jest.fn();
  const getKyMock = ({ resolves = true } = {}) => ({
    get: jest.fn((url) => ({
      json: () => Promise[resolves ? 'resolve' : 'reject'](kyResponsecMap[url]),
    })),
  });

  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue(getKyMock());
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

  it('should use \'Invalid reference\' label if FY fetching was failed', async () => {
    useOkapiKy.mockClear().mockReturnValue(getKyMock({ resolves: false }));

    const { result } = renderHook(() => useRolloverErrorHandler({ ledger, currentFiscalYear }));

    await result.current(getErrorResponse(ERROR_CODE_CONFLICT));

    expect(showCallout).toHaveBeenCalledWith(expect.objectContaining({
      values: expect.objectContaining({ toFYcode: <FormattedMessage id="stripes-acq-components.invalidReference" /> }),
    }));
  });
});
