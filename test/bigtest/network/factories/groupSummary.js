import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  id: faker.random.uuid,
  allocated: faker.random.number.bind(null, { min: 10 }),
  unavailable: faker.random.number,
  available: faker.random.number,
});
