import {
  createGetAll,
  createGetById,
  createPost,
  createPut,
} from '@folio/stripes-acq-components/test/bigtest/network/configs';

import { GROUPS_API } from '../../../../src/common/const';

const SCHEMA_NAME = 'groups';

const configGroups = server => {
  server.get(GROUPS_API, createGetAll(SCHEMA_NAME));
  server.get(`${GROUPS_API}/:id`, createGetById(SCHEMA_NAME));
  server.post(GROUPS_API, createPost(SCHEMA_NAME));
  server.put(`${GROUPS_API}/:id`, createPut(SCHEMA_NAME));
  server.delete(`${GROUPS_API}/:id`, createGetById(SCHEMA_NAME));
  server.get(`${GROUPS_API}/:id/expense-classes-totals`, createGetAll('groupExpenseClassTotals'));
};

export default configGroups;
