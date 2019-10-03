import {
  createGetAll,
} from '@folio/stripes-acq-components/test/bigtest/network/configs';

import { GROUP_FUND_FISCAL_YEARS_API } from '../../../../src/common/const';

const SCHEMA_NAME = 'groupFundFiscalYears';

const configGroupFundFiscalYears = server => {
  server.get(GROUP_FUND_FISCAL_YEARS_API, createGetAll(SCHEMA_NAME));
};

export default configGroupFundFiscalYears;
