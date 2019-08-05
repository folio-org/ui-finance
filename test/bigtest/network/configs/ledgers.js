import { LEDGERS_API } from '../../../../src/common/const';

const configLedgers = server => {
  server.get(LEDGERS_API, (schema) => {
    return schema.ledgers.all();
  });
};

export default configLedgers;
