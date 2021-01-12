import { baseManifest } from '@folio/stripes-acq-components';

import {
  LEDGER_ROLLOVER_API,
  LEDGER_ROLLOVER_ERRORS_API,
  LEDGER_ROLLOVER_PROGRESS_API,
  LEDGERS_API,
} from '../const';

export const ledgersResource = {
  ...baseManifest,
  path: LEDGERS_API,
  params: {
    query: 'cql.allRecords=1 sortby name',
  },
  records: 'ledgers',
};

export const ledgerByUrlIdResource = {
  ...baseManifest,
  path: `${LEDGERS_API}/:{id}`,
};

export const ledgerRolloverResource = {
  ...baseManifest,
  accumulate: true,
  fetch: false,
  path: LEDGER_ROLLOVER_API,
  records: 'ledgerFiscalYearRollovers',
};

export const ledgerRolloverProgressResource = {
  ...baseManifest,
  accumulate: true,
  fetch: false,
  path: LEDGER_ROLLOVER_PROGRESS_API,
  records: 'ledgerFiscalYearRolloverProgresses',
};

export const ledgerRolloverErrorsResource = {
  ...baseManifest,
  accumulate: true,
  fetch: false,
  path: LEDGER_ROLLOVER_ERRORS_API,
  records: 'ledgerFiscalYearRolloverErrors',
};
