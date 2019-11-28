import { Response } from '@bigtest/mirage';
import {
  createGetAll,
  createPost,
} from '@folio/stripes-acq-components/test/bigtest/network/configs/utils';

import {
  ALLOCATIONS_API,
  ENCUMBRANCES_API,
  TRANSACTIONS_API,
  TRANSFERS_API,
} from '../../../../src/common/const';

const TRANSACTIONS_SCHEMA_NAME = 'transactions';

const configTransactions = server => {
  server.get(TRANSACTIONS_API, createGetAll(TRANSACTIONS_SCHEMA_NAME));

  server.get(`${TRANSACTIONS_API}/:id`, (schema, request) => {
    const transactionSchema = schema.transactions.find(request.params.id);

    if (!transactionSchema) {
      return new Response(404, {
        'X-Okapi-Token': `myOkapiToken:${Date.now()}`,
      }, {});
    }

    return transactionSchema.attrs;
  });

  server.post(TRANSFERS_API, createPost(TRANSACTIONS_SCHEMA_NAME));

  server.post(ALLOCATIONS_API, createPost(TRANSACTIONS_SCHEMA_NAME));

  server.post(ENCUMBRANCES_API, createPost(TRANSACTIONS_SCHEMA_NAME));
};

export default configTransactions;
