import {
  createGetAll,
  createGetById,
  createPost,
  createPut,
} from '@folio/stripes-acq-components/test/bigtest/network/configs';

import { LEDGERS_API } from '../../../../src/common/const';

const SCHEMA_NAME = 'ledgers';

const configLedgers = server => {
  server.get(LEDGERS_API, createGetAll(SCHEMA_NAME));
  server.get(`${LEDGERS_API}/:id`, createGetById(SCHEMA_NAME));
  server.post(LEDGERS_API, createPost(SCHEMA_NAME));
  server.put(`${LEDGERS_API}/:id`, createPut(SCHEMA_NAME));
};

export default configLedgers;
