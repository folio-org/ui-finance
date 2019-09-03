import { FISCAL_YEARS_API } from '../../../../src/common/const';

const configFiscalYears = server => {
  server.get(FISCAL_YEARS_API, (schema) => {
    return schema.fiscalYears.all();
  });

  server.get(`${FISCAL_YEARS_API}/:id`, (schema, request) => {
    return schema.fiscalYears.find(request.params.id).attrs;
  });
};

export default configFiscalYears;
