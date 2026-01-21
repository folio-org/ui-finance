import {
  GROUPS_ROUTE,
  LEDGERS_ROUTE,
} from './routes';

export const CHUNK_LIMIT = 25;
export const NO_ID = 'noId';

export const CREATE_UNITS_PERM = 'finance.acquisitions-units-assignments.assign';
export const MANAGE_UNITS_PERM = 'finance.acquisitions-units-assignments.manage';

export const OVERALL_ROLLOVER_STATUS = {
  inProgress: 'In Progress',
  success: 'Success',
  error: 'Error',
  notStarted: 'Not Started',
};

export const ENCUMBRANCE_STATUS = {
  released: 'Released',
  unreleased: 'Unreleased',
};

export const LEDGER_ROLLOVER_TYPES = {
  commit: 'Commit',
  preview: 'Preview',
  rollback: 'Rollback',
};

export const EXPORT_FUND_FIELDS = {
  fundName: 'Name (Fund)',
  fundCode: 'Code (Fund)',
  fundStatus: 'Status (Fund)',
  fundType: 'Type',
  fundGroups: 'Group (Code)',
  acqUnits: 'Acquisition unit',
  transferFrom: 'Transfer from',
  transferTo: 'Transfer to',
  externalAccountNo: 'External account number',
  fundDescription: 'Description',
};

export const EXPORT_BUDGET_FIELDS = {
  budgetName: 'Name (Budget)',
  budgetStatus: 'Status (Budget)',
  allowableEncumbrance: 'Allowable encumbrance',
  allowableExpenditure: 'Allowable expenditure',
  createdDate: 'Date created (Budget)',
  initialAllocation: 'Initial allocation',
  allocatedIncrease: 'Increase',
  allocatedDecrease: 'Decrease',
  totalAllocated: 'Total allocation',
  transfers: 'Transfers',
  totalFunding: 'Total Funding',
  budgetEncumbered: 'Encumbered (Budget)',
  awaitingPayment: 'Awaiting payment (Budget)',
  expended: 'Expended (Budget)',
  credited: 'Credited (Budget)',
  unavailable: 'Unavailable',
  overEncumbered: 'Over encumbered',
  overExpended: 'Over expended',
  cashBalance: 'Cash balance',
  available: 'Available',
};

export const EXPORT_EXPENSE_CLASS_FIELDS = {
  expenseClassName: 'Name (Exp Class)',
  expenseClassCode: 'Code (Exp Class)',
  expenseClassStatus: 'Status (Exp Class)',
  expenseClassEncumbered: 'Encumbered (Exp Class)',
  expenseClassAwaitingPayment: 'Awaiting payment (Exp Class)',
  expenseClassExpended: 'Expended (Exp Class)',
  expenseCredited: 'Credited (Exp Class)',
  percentageOfTotalExpended: 'Percentage of total expended',
};

export const BATCH_TRANSACTION_TYPES = {
  transactionsToCreate: 'transactionsToCreate',
  transactionsToUpdate: 'transactionsToUpdate',
  idsOfTransactionsToDelete: 'idsOfTransactionsToDelete',
  transactionPatches: 'transactionPatches',
};

export const EXPORT_ALLOCATION_WORKSHEET_FIELDS = {
  fiscalYear: 'fiscalYear',
  fundName: 'fundName',
  fundCode: 'fundCode',
  fundId: 'fundId',
  fundStatus: 'fundStatus',
  budgetName: 'budgetName',
  budgetId: 'budgetId',
  budgetStatus: 'budgetStatus',
  budgetInitialAllocation: 'budgetInitialAllocation',
  budgetCurrentAllocation: 'budgetCurrentAllocation',
  budgetAllowableExpenditure: 'budgetAllowableExpenditure',
  budgetAllowableEncumbrance: 'budgetAllowableEncumbrance',
  budgetAllocationChange: 'budgetAllocationChange',
  transactionTag: 'transactionTag',
  transactionDescription: 'transactionDescription',
};

export const EXPORT_ALLOCATION_WORKSHEET_FIELDS_LABELS = {
  [EXPORT_ALLOCATION_WORKSHEET_FIELDS.fiscalYear]: 'Fiscal year',
  [EXPORT_ALLOCATION_WORKSHEET_FIELDS.fundName]: 'Fund name',
  [EXPORT_ALLOCATION_WORKSHEET_FIELDS.fundCode]: 'Fund code',
  [EXPORT_ALLOCATION_WORKSHEET_FIELDS.fundId]: 'Fund UUID',
  [EXPORT_ALLOCATION_WORKSHEET_FIELDS.fundStatus]: 'Fund status',
  [EXPORT_ALLOCATION_WORKSHEET_FIELDS.budgetName]: 'Budget name',
  [EXPORT_ALLOCATION_WORKSHEET_FIELDS.budgetId]: 'Budget UUID',
  [EXPORT_ALLOCATION_WORKSHEET_FIELDS.budgetStatus]: 'Budget status',
  [EXPORT_ALLOCATION_WORKSHEET_FIELDS.budgetInitialAllocation]: 'Budget initial allocation',
  [EXPORT_ALLOCATION_WORKSHEET_FIELDS.budgetCurrentAllocation]: 'Budget current allocation',
  [EXPORT_ALLOCATION_WORKSHEET_FIELDS.budgetAllowableExpenditure]: 'Budget allowable expenditure',
  [EXPORT_ALLOCATION_WORKSHEET_FIELDS.budgetAllowableEncumbrance]: 'Budget allowable encumbrance',
  [EXPORT_ALLOCATION_WORKSHEET_FIELDS.budgetAllocationChange]: 'Allocation adjustment',
  [EXPORT_ALLOCATION_WORKSHEET_FIELDS.transactionTag]: 'Transaction tag',
  [EXPORT_ALLOCATION_WORKSHEET_FIELDS.transactionDescription]: 'Transaction description',
};

export const ALLOCATION_WORKSHEET_REQUIRED_FIELDS = [
  EXPORT_ALLOCATION_WORKSHEET_FIELDS.fiscalYear,
  EXPORT_ALLOCATION_WORKSHEET_FIELDS.fundName,
  EXPORT_ALLOCATION_WORKSHEET_FIELDS.fundCode,
  EXPORT_ALLOCATION_WORKSHEET_FIELDS.fundId,
  EXPORT_ALLOCATION_WORKSHEET_FIELDS.fundStatus,
  EXPORT_ALLOCATION_WORKSHEET_FIELDS.budgetName,
  EXPORT_ALLOCATION_WORKSHEET_FIELDS.budgetId,
  EXPORT_ALLOCATION_WORKSHEET_FIELDS.budgetStatus,
  EXPORT_ALLOCATION_WORKSHEET_FIELDS.budgetInitialAllocation,
];

export const BATCH_ALLOCATIONS_UPLOAD_STORAGE_KEY = 'batch-allocations-upload';
export const BATCH_ALLOCATIONS_SOURCE = {
  ledger: 'ledger',
  group: 'group',
};

export const BATCH_ALLOCATION_ROUTES_DICT = {
  [BATCH_ALLOCATIONS_SOURCE.group]: GROUPS_ROUTE,
  [BATCH_ALLOCATIONS_SOURCE.ledger]: LEDGERS_ROUTE,
};

export const FILE_EXTENSIONS = {
  csv: 'csv',
};

export const ERROR_CODES = {
  currentFiscalYearNotFound: 'currentFiscalYearNotFound',
  plannedFiscalYearNotFound: 'plannedFiscalYearNotFound',
};
