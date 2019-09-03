import { FUNDS_API } from '../../../../src/common/const';

const configFunds = server => {
  server.get(FUNDS_API, (schema) => {
    return schema.funds.all();
  });

  server.get(`${FUNDS_API}/:id`, (schema, request) => {
    return schema.funds.find(request.params.id).attrs;
  });
};

export default configFunds;
