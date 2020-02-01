import {
  createPost,
} from '@folio/stripes-acq-components/test/bigtest/network/configs/utils';
import {
  configTransactions as commonCT,
  TRANSACTIONS_SCHEMA_NAME,
} from '@folio/stripes-acq-components/test/bigtest/network';

import {
  ALLOCATIONS_API,
  ENCUMBRANCES_API,
  TRANSFERS_API,
} from '../../../../src/common/const';

const configTransactions = server => {
  commonCT(server);
  server.post(TRANSFERS_API, createPost(TRANSACTIONS_SCHEMA_NAME));

  server.post(ALLOCATIONS_API, createPost(TRANSACTIONS_SCHEMA_NAME));

  server.post(ENCUMBRANCES_API, createPost(TRANSACTIONS_SCHEMA_NAME));
};

export default configTransactions;
