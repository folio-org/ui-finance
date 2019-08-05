import { BUDGETS_API } from '../../../../src/common/const';

// TODO: replace me with groups
const configBudgets = server => {
  server.get(BUDGETS_API, () => {
    return [];
  });
};

export default configBudgets;
