import {
  createPost,
} from '@folio/stripes-acq-components/test/bigtest/network/configs/utils';
import {
  configTransactions as commonCT,
  TRANSACTIONS_SCHEMA_NAME,
} from '@folio/stripes-acq-components/test/bigtest/network';

import { BATCH_TRANSACTIONS_API } from '../../../../src/common/const';

const configTransactions = server => {
  commonCT(server);
  server.post(BATCH_TRANSACTIONS_API, createPost(TRANSACTIONS_SCHEMA_NAME));
};

export default configTransactions;
