import { Factory } from 'miragejs';
import faker from 'faker';

import { LEDGER_STATUS } from '../../../../src/components/Ledger/constants';

export default Factory.extend({
  id: faker.random.uuid,
  name: faker.finance.accountName,
  code: 'ONETIME',
  description: faker.random.word,
  ledgerStatus: LEDGER_STATUS.active,
  fiscalYears: [],
});
