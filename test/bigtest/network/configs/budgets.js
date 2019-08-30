import { BUDGETS_API } from '../../../../src/common/const';

const configBudgets = server => {
  server.get(BUDGETS_API, (schema) => {
    return schema.budgets.all();
  });

  server.get(`${BUDGETS_API}/:id`, (schema, request) => {
    return schema.budgets.find(request.params.id).attrs;
  });
};

export default configBudgets;
