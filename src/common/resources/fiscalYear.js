import {
  baseManifest,
  LIMIT_MAX,
} from '@folio/stripes-acq-components';

import {
  GROUP_FUND_FISCAL_YEARS_API,
  FISCAL_YEARS_API,
  LEDGER_CURRENT_FISCAL_YEAR_API,
} from '../const';

export const fiscalYearsResource = {
  ...baseManifest,
  path: FISCAL_YEARS_API,
  records: 'fiscalYears',
  params: (_q, _p, _r, _l, props) => {
    const series = props.series;
    const seriesQuery = series ? `series==${series}` : 'cql.allRecords=1';
    const query = `${seriesQuery} sortby periodStart`;

    return {
      limit: `${LIMIT_MAX}`,
      query,
    };
  },
};

export const ledgerCurrentFiscalYearResource = {
  ...baseManifest,
  accumulate: true,
  fetch: false,
  path: LEDGER_CURRENT_FISCAL_YEAR_API,
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
