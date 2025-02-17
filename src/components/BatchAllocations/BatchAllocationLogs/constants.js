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

export const BATCH_ALLOCATION_LOG_STATUSES = {
  COMPLETED: 'completed',
  ERROR: 'error',
  IN_PROGRESS: 'inProgress',
};
