import { BROWSE_FILTERS } from '../constants';

const matchesStatus = (status, selectedStatuses) => (
  !selectedStatuses?.length || selectedStatuses.includes(status)
);

/**
 * Filters the Browse hierarchy by the selected status filters, independently
 * at each level (ledger/group/fund/budget/expenseClass). A record whose own
 * status doesn't match its level's filter is removed along with its
 * descendants; a record that does match stays visible even if none of its
 * descendants match their own filters. The synthetic "Ungrouped" bucket has
 * no real status, so group status filters never hide it.
 */
export const filterHierarchy = (hierarchy, filters = {}) => {
  const ledgerStatuses = filters[BROWSE_FILTERS.LEDGER_STATUS];
  const groupStatuses = filters[BROWSE_FILTERS.GROUP_STATUS];
  const fundStatuses = filters[BROWSE_FILTERS.FUND_STATUS];
  const budgetStatuses = filters[BROWSE_FILTERS.BUDGET_STATUS];
  const expenseClassStatuses = filters[BROWSE_FILTERS.EXPENSE_CLASS_STATUS];

  return (hierarchy || [])
    .filter(ledger => matchesStatus(ledger.status, ledgerStatuses))
    .map(ledger => ({
      ...ledger,
      groups: (ledger.groups || [])
        .filter(group => group.isUngrouped || matchesStatus(group.status, groupStatuses))
        .map(group => ({
          ...group,
          funds: (group.funds || [])
            .filter(fund => matchesStatus(fund.status, fundStatuses))
            .map(fund => ({
              ...fund,
              budgets: (fund.budgets || [])
                .filter(budget => matchesStatus(budget.status, budgetStatuses))
                .map(budget => ({
                  ...budget,
                  expenseClasses: (budget.expenseClasses || [])
                    .filter(expenseClass => matchesStatus(expenseClass.status, expenseClassStatuses)),
                })),
            })),
        })),
    }));
};

export default filterHierarchy;
