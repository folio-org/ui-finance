import BaseSerializer from './base';

const { isArray } = Array;

export default BaseSerializer.extend({
  serialize(...args) {
    const json = BaseSerializer.prototype.serialize.apply(this, args);

    if (isArray(json.budgets)) {
      return {
        budgets: json.budgets,
        totalRecords: json.budgets.length,
      };
    }

    return json.budgets;
  },
});
