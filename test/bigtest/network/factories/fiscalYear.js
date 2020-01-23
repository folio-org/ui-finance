import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  id: faker.random.uuid,
  name: faker.finance.accountName,
  code: faker.finance.account,
  periodStart: faker.date.past,
  periodEnd: faker.date.future,
});
