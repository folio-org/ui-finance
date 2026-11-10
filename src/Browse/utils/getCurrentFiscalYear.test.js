import { getCurrentFiscalYear } from './getCurrentFiscalYear';

const fiscalYears = [
  { id: 'fy-2023', periodStart: '2023-01-01T00:00:00.000+00:00', periodEnd: '2023-12-31T23:59:59.000+00:00' },
  { id: 'fy-2024', periodStart: '2024-01-01T00:00:00.000+00:00', periodEnd: '2024-12-31T23:59:59.000+00:00' },
];

describe('getCurrentFiscalYear', () => {
  it('should return the fiscal year whose period contains the date', () => {
    expect(getCurrentFiscalYear(fiscalYears, new Date('2024-06-15T00:00:00Z'))?.id).toBe('fy-2024');
  });

  it('should return undefined when no fiscal year period contains the date', () => {
    expect(getCurrentFiscalYear(fiscalYears, new Date('2030-06-15T00:00:00Z'))).toBeUndefined();
  });
});
