import { RestSerializer } from 'miragejs';

export default RestSerializer.extend({
  keyForAttribute(attr) {
    return attr;
  },
});
