import BaseSerializer from './base';

const { isArray } = Array;

export default BaseSerializer.extend({
  serialize(...args) {
    const json = BaseSerializer.prototype.serialize.apply(this, args);

    if (isArray(json.groups)) {
      return {
        groups: json.groups,
        totalRecords: json.groups.length,
      };
    }

    return json.groups;
  },
});
