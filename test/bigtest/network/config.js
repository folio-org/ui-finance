import {
  configFunds,
  configMemberships,
  configTags,
  configUnits,
  configUsers,
  configLines,
} from '@folio/stripes-acq-components/test/bigtest/network';

import configBudgets from './configs/budgets';
import configExpenseClasses from './configs/expenseClasses';
import configFiscalYears from './configs/fiscalYears';
import configGroupFundFiscalYears from './configs/groupFundFiscalYears';
import configGroups from './configs/groups';
import configLedgers from './configs/ledgers';
import configTransactions from './configs/transactions';
import configFundTypes from './configs/fundTypes';
import configGroupSummaries from './configs/groupSummaries';

export default function config() {
  configBudgets(this);
  configFiscalYears(this);
  configGroupFundFiscalYears(this);
  configFunds(this);
  configGroups(this);
  configLedgers(this);
  configTransactions(this);
  configMemberships(this);
  configUnits(this);
  configTags(this);
  configUsers(this);
  configFundTypes(this);
  configGroupSummaries(this);
  configLines(this);
  configExpenseClasses(this);
}
