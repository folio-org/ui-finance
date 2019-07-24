import { RestSerializer } from '@bigtest/mirage';

export default RestSerializer.extend({
  keyForAttribute(attr) {
    return attr;
  },
});
