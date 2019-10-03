import {
  createGetById,
} from '@folio/stripes-acq-components/test/bigtest/network/configs';

import { ACQUISITIONS_UNITS_API } from '../../../../src/common/const';

const SCHEMA_NAME = 'acquisitionsUnits';

const configAcquisitionsUnits = server => {
  server.get(`${ACQUISITIONS_UNITS_API}/:id`, createGetById(SCHEMA_NAME));
};

export default configAcquisitionsUnits;
