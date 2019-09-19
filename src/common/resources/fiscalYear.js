import { baseManifest } from '@folio/stripes-acq-components';

import {
  FISCAL_YEAR_FUNDS_API,
  FISCAL_YEAR_GROUPS_API,
  FISCAL_YEAR_LEDGERS_API,
  GROUP_FUND_FISCAL_YEARS_API,
  FISCAL_YEARS_API,
} from '../const';

export const fiscalYearsResource = {
  ...baseManifest,
  path: FISCAL_YEARS_API,
  records: 'fiscalYears',
};

export const fiscalYearResource = {
  ...baseManifest,
  path: `${FISCAL_YEARS_API}/:{id}`,
};

export const fiscalYearFundsResource = {
  ...baseManifest,
  path: FISCAL_YEAR_FUNDS_API,
  records: 'funds',
  accumulate: true,
  fetch: false,
};

export const fiscalYearLedgersResource = {
  ...baseManifest,
  path: FISCAL_YEAR_LEDGERS_API,
  records: 'ledgers',
  accumulate: true,
  fetch: false,
};

export const fiscalYearGroupsResource = {
  ...baseManifest,
  path: FISCAL_YEAR_GROUPS_API,
  records: 'groups',
  accumulate: true,
  fetch: false,
};

export const groupFundFiscalYears = {
  ...baseManifest,
  path: GROUP_FUND_FISCAL_YEARS_API,
  records: 'groupFundFiscalYears',
  accumulate: true,
  fetch: false,
};
