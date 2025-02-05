/* Developed collaboratively using AI (Chat GPT) */

import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useGroupUpcomingFiscalYears } from '../useGroupUpcomingFiscalYears';
import { useLedgerUpcomingFiscalYears } from '../useLedgerUpcomingFiscalYears';
import { useUpcomingFiscalYears } from './useUpcomingFiscalYears';

jest.mock('../useGroupUpcomingFiscalYears', () => ({
  useGroupUpcomingFiscalYears: jest.fn(),
}));

jest.mock('../useLedgerUpcomingFiscalYears', () => ({
  useLedgerUpcomingFiscalYears: jest.fn(),
}));

describe('useUpcomingFiscalYears', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useGroupUpcomingFiscalYears.mockReturnValue({ data: 'groupData' });
    useLedgerUpcomingFiscalYears.mockReturnValue({ data: 'ledgerData' });
  });

  it('should call useGroupUpcomingFiscalYears when groupId is provided', () => {
    const { result } = renderHook(() => useUpcomingFiscalYears({ groupId: '123' }));

    expect(useGroupUpcomingFiscalYears).toHaveBeenCalledWith('123', {});
    expect(result.current).toEqual({ data: 'groupData' });
  });

  it('should call useLedgerUpcomingFiscalYears when ledgerId is provided', () => {
    const { result } = renderHook(() => useUpcomingFiscalYears({ ledgerId: '456' }));

    expect(useLedgerUpcomingFiscalYears).toHaveBeenCalledWith('456', {});
    expect(result.current).toEqual({ data: 'ledgerData' });
  });

  it('should pass options to the underlying hook', () => {
    const options = { someOption: 'value' };
    const { result } = renderHook(() => useUpcomingFiscalYears({ groupId: '123' }, options));

    expect(useGroupUpcomingFiscalYears).toHaveBeenCalledWith('123', options);
    expect(result.current).toEqual({ data: 'groupData' });
  });
});
