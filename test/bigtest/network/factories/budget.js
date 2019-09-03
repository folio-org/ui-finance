import { Factory, faker } from '@bigtest/mirage';

import { BUDGET_STATUSES } from '../../../../src/components/Budget/constants';

export default Factory.extend({
  id: faker.random.uuid,
  name: faker.finance.accountName,
  budgetStatus: BUDGET_STATUSES.ACTIVE,
});
