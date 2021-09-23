import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  id: faker.datatype.uuid,
  name: faker.finance.accountName,
  code: faker.finance.account,
  status: 'Active',
});
