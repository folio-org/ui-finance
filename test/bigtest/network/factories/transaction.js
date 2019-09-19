import { Factory, faker } from '@bigtest/mirage';

export default Factory.extend({
  amount: faker.finance.amount,
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
