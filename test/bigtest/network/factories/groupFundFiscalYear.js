import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  id: faker.datatype.uuid,
  available: () => Number(faker.finance.amount(1000, 10000, 2)),
});
