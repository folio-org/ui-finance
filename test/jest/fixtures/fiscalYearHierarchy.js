// Response of `finance-storage/fiscal-year-hierarchy` for one fiscal year
export const hierarchyResponse = {
  totalRecords: 2,
  fiscalYearHierarchies: [
    {
      fiscalYearId: 'fy-1',
      fiscalYearCode: 'FY2024',
      ledgerId: 'ledger-2',
      ledgerCode: 'ONETIME',
      ledgerName: 'One-time',
      groups: [
        {
          groupId: 'group-1',
          groupCode: 'HIST',
          groupName: 'History',
          funds: [
            {
              fundId: 'fund-2',
              fundCode: 'ASIAHIST',
              fundName: 'Asian History',
            },
            {
              fundId: 'fund-1',
              fundCode: 'AFRICAHIST',
              fundName: 'African History',
              budget: {
                budgetId: 'budget-1',
                budgetName: 'AFRICAHIST-FY2024',
                budgetStatus: 'Active',
                budgetExpenseClasses: [
                  { expenseClassId: 'ec-2', expenseClassName: 'Print', status: 'Inactive' },
                  { expenseClassId: 'ec-1', expenseClassName: 'Electronic', status: 'Active' },
                ],
              },
            },
          ],
        },
      ],
      funds: [
        {
          fundId: 'fund-3',
          fundCode: 'EXCH',
          fundName: 'Exchanges',
          budget: {
            budgetId: 'budget-2',
            budgetName: 'EXCH-FY2024',
            budgetStatus: 'Planned',
            budgetExpenseClasses: [
              { expenseClassId: 'ec-1', expenseClassName: 'Electronic', status: 'Active' },
            ],
          },
        },
      ],
    },
    {
      fiscalYearId: 'fy-1',
      fiscalYearCode: 'FY2024',
      ledgerId: 'ledger-1',
      ledgerCode: 'MAIN-LIB',
      ledgerName: 'Main Library',
      groups: [
        {
          groupId: 'group-1',
          groupCode: 'HIST',
          groupName: 'History',
          funds: [
            {
              fundId: 'fund-4',
              fundCode: 'ANZHIST',
              fundName: 'Oceania History',
            },
          ],
        },
      ],
      funds: [],
    },
  ],
};
