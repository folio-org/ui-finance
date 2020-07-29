import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  id: faker.random.uuid,
  expenseClassName: faker.finance.accountName,
  encumbered: () => Number(faker.finance.amount(100, 1000, 2)),
  awaitingPayment: () => Number(faker.finance.amount(100, 1000, 2)),
  expended: () => Number(faker.finance.amount(100, 1000, 2)),
  percentageExpended: () => faker.random.number(100),
});
