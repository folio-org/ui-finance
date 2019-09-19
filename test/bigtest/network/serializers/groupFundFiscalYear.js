import BaseSerializer from './base';

const { isArray } = Array;

export default BaseSerializer.extend({
  serialize(...args) {
    const json = BaseSerializer.prototype.serialize.apply(this, args);

    if (isArray(json.groupFundFiscalYears)) {
      return {
        groupFundFiscalYears: json.groupFundFiscalYears,
        totalRecords: json.groupFundFiscalYears.length,
      };
    }

    return json.groupFundFiscalYears;
  },
});
