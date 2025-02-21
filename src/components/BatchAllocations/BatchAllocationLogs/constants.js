export const BATCH_ALLOCATION_LOG_FIELDS = {
  jobName: 'jobName',
  status: 'status',
  recordsCount: 'recordsCount',
  createdDate: 'createdDate',
  updatedDate: 'updatedDate',
  createdByUsername: 'createdByUsername',
  jobNumber: 'jobNumber',
};

export const BATCH_ALLOCATION_LOG_COLUMNS = [
  'select',
  BATCH_ALLOCATION_LOG_FIELDS.jobName,
  BATCH_ALLOCATION_LOG_FIELDS.status,
  BATCH_ALLOCATION_LOG_FIELDS.recordsCount,
  BATCH_ALLOCATION_LOG_FIELDS.createdDate,
  BATCH_ALLOCATION_LOG_FIELDS.updatedDate,
  BATCH_ALLOCATION_LOG_FIELDS.createdByUsername,
  BATCH_ALLOCATION_LOG_FIELDS.jobNumber,
];

export const BATCH_ALLOCATION_LOGS_COLUMNS_WIDTHS = {
  select: '4%',
  [BATCH_ALLOCATION_LOG_FIELDS.jobName]: '26%',
  [BATCH_ALLOCATION_LOG_FIELDS.status]: '12%',
  [BATCH_ALLOCATION_LOG_FIELDS.recordsCount]: '6%',
  [BATCH_ALLOCATION_LOG_FIELDS.createdDate]: '14%',
  [BATCH_ALLOCATION_LOG_FIELDS.updatedDate]: '14%',
  [BATCH_ALLOCATION_LOG_FIELDS.createdByUsername]: '20%',
  [BATCH_ALLOCATION_LOG_FIELDS.jobNumber]: '4%',
};

export const FILTERS = {
  DATE: 'metadata.createdDate',
  FISCAL_YEAR: 'fiscalYearId',
  GROUP: 'groupId',
  LEDGER: 'ledgerId',
  USER: 'metadata.createdByUserId',
};
