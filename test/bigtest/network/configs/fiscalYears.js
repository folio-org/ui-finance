import {
  createGetAll,
  createGetById,
  createPost,
  createPut,
} from '@folio/stripes-acq-components/test/bigtest/network/configs';

import { FISCAL_YEARS_API } from '../../../../src/common/const';

export const SCHEMA_NAME = 'fiscalYears';

const configFiscalYears = server => {
  server.get(FISCAL_YEARS_API, createGetAll(SCHEMA_NAME));
  server.get(`${FISCAL_YEARS_API}/:id`, createGetById(SCHEMA_NAME));
  server.post(FISCAL_YEARS_API, createPost(SCHEMA_NAME));
  server.put(`${FISCAL_YEARS_API}/:id`, createPut(SCHEMA_NAME));
  server.delete(`${FISCAL_YEARS_API}/:id`, createGetById(SCHEMA_NAME));
};

export default configFiscalYears;
