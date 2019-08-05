import BaseSerializer from './base';

const { isArray } = Array;

export default BaseSerializer.extend({
  serialize(...args) {
    const json = BaseSerializer.prototype.serialize.apply(this, args);

    if (isArray(json.fiscalYears)) {
      return {
        fiscalYears: json.fiscalYears,
        totalRecords: json.fiscalYears.length,
      };
    }

    return json.fiscalYears;
  },
});
