import { baseManifest } from '@folio/stripes-acq-components';

import {
  GROUP_FUND_FISCAL_YEARS_API,
  FISCAL_YEARS_API,
  LEDGER_CURRENT_FISCAL_YEAR_API,
} from '../const';

export const fiscalYearsResource = {
  ...baseManifest,
  path: FISCAL_YEARS_API,
  records: 'fiscalYears',
};

export const ledgerCurrentFiscalYearResource = {
  accumulate: true,
  fetch: false,
  path: LEDGER_CURRENT_FISCAL_YEAR_API,
  ...baseManifest,
};

export const fiscalYearResource = {
  ...baseManifest,
  path: `${FISCAL_YEARS_API}/:{id}`,
};

export const groupFundFiscalYears = {
  ...baseManifest,
  path: GROUP_FUND_FISCAL_YEARS_API,
  records: 'groupFundFiscalYears',
  accumulate: true,
  fetch: false,
};
