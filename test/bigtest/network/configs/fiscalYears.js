import { FISCAL_YEARS_API } from '../../../../src/common/const';

const configFiscalYears = server => {
  server.get(FISCAL_YEARS_API, (schema) => {
    return schema.fiscalYears.all();
  });
};

export default configFiscalYears;
