import {
  createGetAll,
  createGetById,
  createPost,
  createPut,
} from '@folio/stripes-acq-components/test/bigtest/network/configs';

import { BUDGETS_API } from '../../../../src/common/const';

const SCHEMA_NAME = 'budgets';

const configBudgets = server => {
  server.get(BUDGETS_API, createGetAll(SCHEMA_NAME));
  server.get(`${BUDGETS_API}/:id`, createGetById(SCHEMA_NAME));
  server.post(BUDGETS_API, createPost(SCHEMA_NAME));
  server.put(`${BUDGETS_API}/:id`, createPut(SCHEMA_NAME));
};

export default configBudgets;
