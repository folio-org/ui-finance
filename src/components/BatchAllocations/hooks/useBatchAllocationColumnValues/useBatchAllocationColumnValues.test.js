/* Developed collaboratively using AI (Chat GPT) */

import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { BATCH_ALLOCATION_FIELDS } from '../../constants';
import { useBatchAllocationColumnValues } from './useBatchAllocationColumnValues';

describe('useBatchAllocationColumnValues', () => {
  const mockIntl = { formatMessage: jest.fn() };

  it('should return the expected column components', () => {
    const { result } = renderHook(() => useBatchAllocationColumnValues(mockIntl));

    expect(result.current).toHaveProperty('fundStatus');
    expect(result.current).toHaveProperty('budgetStatus');
    expect(result.current).toHaveProperty('allocationIncreaseDecrease');
    expect(result.current).toHaveProperty('totalAllocatedAfter');
    expect(result.current).toHaveProperty('budgetAllowableEncumbrance');
    expect(result.current).toHaveProperty('budgetAllowableExpenditure');
    expect(result.current).toHaveProperty('transactionDescription');
    expect(result.current).toHaveProperty('fundTags');
  });

  it('should return correct field names for budget status', () => {
    const { result } = renderHook(() => useBatchAllocationColumnValues(mockIntl));

    const budgetStatusComponent = result.current.budgetStatus({ rowIndex: 1 });

    expect(budgetStatusComponent.props.children.props.name)
      .toBe(`budgetsFunds.1.${BATCH_ALLOCATION_FIELDS.budgetStatus}`);
  });

  it('should return correct field names for fund status', () => {
    const { result } = renderHook(() => useBatchAllocationColumnValues(mockIntl));

    const fundStatusComponent = result.current.fundStatus({ rowIndex: 2 });

    expect(fundStatusComponent.props.children.props.name)
      .toBe(`budgetsFunds.2.${BATCH_ALLOCATION_FIELDS.fundStatus}`);
  });

  it('should return correct field names for transaction description', () => {
    const { result } = renderHook(() => useBatchAllocationColumnValues(mockIntl));

    const transactionDescriptionComponent = result.current.transactionDescription({ rowIndex: 0 });

    expect(transactionDescriptionComponent.props.children.props.name)
      .toBe(`budgetsFunds.0.${BATCH_ALLOCATION_FIELDS.transactionDescription}`);
  });
});
