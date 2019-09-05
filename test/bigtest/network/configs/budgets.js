import { BUDGETS_API } from '../../../../src/common/const';

const configBudgets = server => {
  server.get(BUDGETS_API, (schema) => {
    return schema.budgets.all();
  });

  server.get(`${BUDGETS_API}/:id`, (schema, request) => {
    return request.params.id
      ? schema.budgets.find(request.params.id).attrs
      : null;
  });

  server.put(`${BUDGETS_API}/:id`, (schema, request) => {
    const id = request.params.id;
    const attrs = JSON.parse(request.requestBody);

    schema.budgets.find(id).update(attrs);

    return null;
  });

  server.post(BUDGETS_API, (schema, request) => {
    const attrs = JSON.parse(request.requestBody) || {};

    return schema.budgets.create(attrs);
  });
};

export default configBudgets;
