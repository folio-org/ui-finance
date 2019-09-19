import { Factory, faker } from '@bigtest/mirage';

export default Factory.extend({
  id: faker.random.uuid,
  available: faker.finance.amount(1000, 10000, 2),
});
