import { Response } from '@bigtest/mirage';

import { TRANSACTIONS_API } from '../../../../src/common/const';

const configTransactions = server => {
  server.get(TRANSACTIONS_API, (schema) => {
    return schema.transactions.all();
  });

  server.get(`${TRANSACTIONS_API}/:id`, (schema, request) => {
    const transactionSchema = schema.transactions.find(request.params.id);

    if (!transactionSchema) {
      return new Response(404, {
        'X-Okapi-Token': `myOkapiToken:${Date.now()}`,
      }, {});
    }

    return transactionSchema.attrs;
  });

  server.post(TRANSACTIONS_API, (schema, request) => {
    const attrs = JSON.parse(request.requestBody) || {};

    return schema.transactions.create(attrs);
  });
};

export default configTransactions;
