import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  amount: () => Number(faker.finance.amount),
  currency: 'USD',
  description: faker.random.word,
  fiscalYearId: faker.random.uuid,
  fromFundId: faker.random.uuid,
  id: faker.random.uuid,
  source: 'User',
  toFundId: faker.random.uuid,
  transactionType: 'Transfer',
  tags: {
    tagList: [
      'tag 1',
      'tag 3',
    ],
  },
});
