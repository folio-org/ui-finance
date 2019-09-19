import { Factory, faker } from '@bigtest/mirage';

export default Factory.extend({
  id: faker.random.uuid,
  ledgerId: faker.random.uuid,
  fundId: faker.random.uuid,
  fiscalYearId: faker.random.uuid,
  available: 1000,
});
