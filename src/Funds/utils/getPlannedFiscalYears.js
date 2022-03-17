// `budgetFiscalYears` here is expected as an array sorted by `periodStart`
export const getPlannedFiscalYears = (budgetFiscalYears = [], plannedBudgets = []) => (
  budgetFiscalYears
    .slice(1)
    .filter(fiscalYear => (
      !plannedBudgets.find(budget => budget.fiscalYearId === fiscalYear.id)
    ))
);
