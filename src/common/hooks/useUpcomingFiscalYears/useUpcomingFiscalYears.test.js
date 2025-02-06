import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { BATCH_ALLOCATIONS_SOURCE } from '../../const';
import { useGroupUpcomingFiscalYears } from '../useGroupUpcomingFiscalYears';
import { useLedgerUpcomingFiscalYears } from '../useLedgerUpcomingFiscalYears';
import { useUpcomingFiscalYears } from './useUpcomingFiscalYears';

jest.mock('../useGroupUpcomingFiscalYears', () => ({ useGroupUpcomingFiscalYears: jest.fn() }));
jest.mock('../useLedgerUpcomingFiscalYears', () => ({ useLedgerUpcomingFiscalYears: jest.fn() }));

const fiscalYears = [{ id: 'fy1', code: 'FY2025' }];

describe('useUpcomingFiscalYears', () => {
  beforeEach(() => {
    useGroupUpcomingFiscalYears.mockReturnValue({ fiscalYears });
    useLedgerUpcomingFiscalYears.mockReturnValue({ fiscalYears });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call useGroupUpcomingFiscalYears when groupId is provided', () => {
    const { result } = renderHook(() => useUpcomingFiscalYears({
      sourceType: BATCH_ALLOCATIONS_SOURCE.group,
      sourceId: '123',
    }));

    expect(useGroupUpcomingFiscalYears).toHaveBeenCalledWith('123', {});
    expect(result.current.fiscalYears).toEqual(fiscalYears);
  });

  it('should call useLedgerUpcomingFiscalYears when ledgerId is provided', () => {
    const { result } = renderHook(() => useUpcomingFiscalYears({
      sourceType: BATCH_ALLOCATIONS_SOURCE.ledger,
      sourceId: '456',
    }));

    expect(useLedgerUpcomingFiscalYears).toHaveBeenCalledWith('456', {});
    expect(result.current.fiscalYears).toEqual(fiscalYears);
  });

  it('should pass options to the underlying hook', () => {
    const options = { someOption: 'value' };
    const { result } = renderHook(() => useUpcomingFiscalYears(
      {
        sourceType: BATCH_ALLOCATIONS_SOURCE.group,
        sourceId: '123',
      },
      options,
    ));

    expect(useGroupUpcomingFiscalYears).toHaveBeenCalledWith('123', options);
    expect(result.current.fiscalYears).toEqual(fiscalYears);
  });
});
