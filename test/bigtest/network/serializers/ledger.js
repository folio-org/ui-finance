import BaseSerializer from './base';

const { isArray } = Array;

export default BaseSerializer.extend({
  serialize(...args) {
    const json = BaseSerializer.prototype.serialize.apply(this, args);

    if (isArray(json.ledgers)) {
      return {
        ledgers: json.ledgers,
        totalRecords: json.ledgers.length,
      };
    }

    return json.ledgers;
  },
});
