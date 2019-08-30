import { LEDGERS_API } from '../../../../src/common/const';

const configLedgers = server => {
  server.get(LEDGERS_API, (schema) => {
    return schema.ledgers.all();
  });

  server.get(`${LEDGERS_API}/:id`, (schema, request) => {
    return schema.ledgers.find(request.params.id).attrs;
  });
};

export default configLedgers;
