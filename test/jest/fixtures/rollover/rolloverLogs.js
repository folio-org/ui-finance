export const rolloverLogs = [
  {
    startDate: '2022-07-13T07:53:30.472+00:00',
    endDate: '2022-07-13T07:53:30.472+00:00',
    status: 'Success',
    budgetsLink: 'https://okapi-bugfest-lotus.int.aws.folio.org/finance/ledger-rollovers-budgets?query=ledgerRolloverId==123',
    ledgerRolloverType: 'Preview',
  },
  {
    startDate: '2022-07-13T07:53:30.472+00:00',
    status: 'In Progress',
    ledgerRolloverType: 'Commit',
  },
  {
    startDate: '2022-07-13T07:53:30.472+00:00',
    endDate: '2022-07-13T07:53:30.472+00:00',
    status: 'Error',
    errorsLink: 'https://okapi-bugfest-lotus.int.aws.folio.org/finance/ledger-rollovers-errors?query=ledgerRolloverId==123',
    budgetsLink: 'https://okapi-bugfest-lotus.int.aws.folio.org/finance/ledger-rollovers-budgets?query=ledgerRolloverId==123',
    ledgerRolloverType: 'Commit',
  },
];
