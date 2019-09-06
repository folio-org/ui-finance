import { Factory, faker } from '@bigtest/mirage';

import { LEDGER_STATUS } from '../../../../src/components/Ledger/constants';

export default Factory.extend({
  id: faker.random.uuid,
  name: faker.finance.accountName,
  code: 'ONETIME',
  description: faker.random.word,
  ledgerStatus: LEDGER_STATUS.active,
  fiscalYears: [],
});
