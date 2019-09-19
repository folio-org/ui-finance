import { GROUP_FUND_FISCAL_YEARS_API } from '../../../../src/common/const';

const configGroupFundFiscalYears = server => {
  server.get(GROUP_FUND_FISCAL_YEARS_API, (schema) => {
    return schema.groupFundFiscalYears.all();
  });
};

export default configGroupFundFiscalYears;
