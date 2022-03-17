import { getPlannedFiscalYears } from './getPlannedFiscalYears';

const mockBudgetsFY = [
  { id: 'fy2022', code: 'FY2022' },
  { id: 'fy2023', code: 'FY2023' },
  { id: 'fy2024', code: 'FY2024' },
  { id: 'fy2025', code: 'FY2025' },
];

const mockPlannedBudgets = [
  { id: 'plannedBudgetFor2024', fiscalYearId: 'fy2024' },
];

describe('getPlannedFiscalYears', () => {
  it('should return planned fiscal years', () => {
    expect(getPlannedFiscalYears(mockBudgetsFY, mockPlannedBudgets)).toEqual([
      mockBudgetsFY[1],
      mockBudgetsFY[3],
    ]);
  });
});
