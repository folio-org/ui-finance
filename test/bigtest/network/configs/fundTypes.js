import {
  createGetAll,
  createGetById,
} from '@folio/stripes-acq-components/test/bigtest/network/configs';

import { FUND_TYPES_API } from '../../../../src/common/const';

const SCHEMA_NAME = 'fundTypes';

const configFundTypes = server => {
  server.get(FUND_TYPES_API, createGetAll(SCHEMA_NAME));
  server.get(`${FUND_TYPES_API}/:id`, createGetById(SCHEMA_NAME));
};

export default configFundTypes;
