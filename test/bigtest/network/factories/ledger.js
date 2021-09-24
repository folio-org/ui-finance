import { Factory } from 'miragejs';
import faker from 'faker';

import { LEDGER_STATUS } from '../../../../src/Ledger/constants';

export default Factory.extend({
  id: faker.datatype.uuid,
  name: faker.finance.accountName,
  code: 'ONETIME',
  description: faker.random.word,
  ledgerStatus: LEDGER_STATUS.active,
  fiscalYears: [],
});
