import {
  createGetAll,
} from '@folio/stripes-acq-components/test/bigtest/network/configs';

import { GROUP_SUMMARIES_API } from '../../../../src/common/const';

const SCHEMA_NAME = 'groupSummaries';

const configGroupSummaries = server => {
  server.get(GROUP_SUMMARIES_API, createGetAll(SCHEMA_NAME));
};

export default configGroupSummaries;
