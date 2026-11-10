export const getCurrentFiscalYear = (fiscalYears, now = new Date()) => (
  fiscalYears.find(({ periodStart, periodEnd }) => new Date(periodStart) <= now && now <= new Date(periodEnd))
);
