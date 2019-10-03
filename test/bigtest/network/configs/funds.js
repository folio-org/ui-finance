import {
  createGetAll,
  createGetById,
  createPost,
  createPut,
} from '@folio/stripes-acq-components/test/bigtest/network/configs';

import { FUNDS_API } from '../../../../src/common/const';

const SCHEMA_NAME = 'funds';

const configFunds = server => {
  server.get(FUNDS_API, createGetAll(SCHEMA_NAME));
  server.get(`${FUNDS_API}/:id`, createGetById(SCHEMA_NAME));
  server.post(FUNDS_API, createPost(SCHEMA_NAME));
  server.put(`${FUNDS_API}/:id`, createPut(SCHEMA_NAME));
  server.delete(`${FUNDS_API}/:id`, createGetById(SCHEMA_NAME));
};

export default configFunds;
