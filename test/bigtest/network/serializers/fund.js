import BaseSerializer from './base';

const { isArray } = Array;

export default BaseSerializer.extend({
  serialize(...args) {
    const json = BaseSerializer.prototype.serialize.apply(this, args);

    if (isArray(json.funds)) {
      return {
        funds: json.funds,
        totalRecords: json.funds.length,
      };
    }

    return json.funds;
  },
});
