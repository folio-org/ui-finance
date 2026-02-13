import { BUDGET_STATUSES } from '../../Budget/constants';
import { BATCH_ALLOCATION_FIELDS } from '../constants';
import { buildInitialValues } from './buildInitialValues';

describe('buildInitialValues', () => {
  const {
    budgetAllocationChange: ALLOCATION_CHANGE,
    budgetStatus: BUDGETS_STATUS,
  } = BATCH_ALLOCATION_FIELDS;

  const fiscalYear = {
    id: 'FY1',
    code: 'FY1',
    periodStart: '2025-01-01',
    series: 'S1',
  };

  const currentFiscalYears = [
    { series: 'S1', periodStart: '2024-01-01' },
  ];

  it('sets BUDGETS_STATUS to PLANNED when fiscal year starts after current fiscal year and isBudgetStatusShouldBeSet true', () => {
    const fileData = [
      { fundId: 'F1', budgetId: '', [ALLOCATION_CHANGE]: '15' },
    ];

    const financeData = [
      { fundId: 'F1', budgetId: '' },
    ];

    const result = buildInitialValues(fileData, financeData, fiscalYear, currentFiscalYears);

    const fyData = result.fyFinanceData;

    expect(fyData).toHaveLength(1);
    expect(fyData[0][ALLOCATION_CHANGE]).toBe(15);
    expect(fyData[0][BUDGETS_STATUS]).toBe(BUDGET_STATUSES.PLANNED);
  });

  it('sets BUDGETS_STATUS to ACTIVE when fiscal year starts before current fiscal year', () => {
    const fileData = [
      { fundId: 'F2', budgetId: '', [ALLOCATION_CHANGE]: '5' },
    ];

    const financeData = [
      { fundId: 'F2', budgetId: '' },
    ];

    const olderFiscalYear = { ...fiscalYear, periodStart: '2023-01-01' };
    const currentFiscalYears2 = [{ series: 'S1', periodStart: '2024-01-01' }];

    const result = buildInitialValues(fileData, financeData, olderFiscalYear, currentFiscalYears2);

    const fyData = result.fyFinanceData;

    expect(fyData).toHaveLength(1);
    expect(fyData[0][ALLOCATION_CHANGE]).toBe(5);
    expect(fyData[0][BUDGETS_STATUS]).toBe(BUDGET_STATUSES.ACTIVE);
  });
});
