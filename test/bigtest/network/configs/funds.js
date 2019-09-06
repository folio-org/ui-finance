import { FUNDS_API } from '../../../../src/common/const';

const configFunds = server => {
  server.get(FUNDS_API, (schema) => {
    return schema.funds.all();
  });

  server.get(`${FUNDS_API}/:id`, (schema, request) => {
    return schema.funds.find(request.params.id).attrs;
  });

  server.put(`${FUNDS_API}/:id`, (schema, request) => {
    const id = request.params.id;
    const attrs = JSON.parse(request.requestBody);

    schema.funds.find(id).update(attrs);

    return null;
  });
};

export default configFunds;
