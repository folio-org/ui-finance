import { FISCAL_YEARS_API } from '../../../../src/common/const';

const configFiscalYears = server => {
  server.get(FISCAL_YEARS_API, (schema) => {
    return schema.fiscalYears.all();
  });

  server.get(`${FISCAL_YEARS_API}/:id`, (schema, request) => {
    return schema.fiscalYears.find(request.params.id).attrs;
  });

  server.put(`${FISCAL_YEARS_API}/:id`, () => null);

  server.post(FISCAL_YEARS_API, (schema, request) => {
    const attrs = JSON.parse(request.requestBody) || {};

    return schema.fiscalYears.create(attrs).attrs;
  });
};

export default configFiscalYears;
