import configAcquisitionsUnits from './configs/acquisitionsUnits';
import configBudgets from './configs/budgets';
import configFiscalYears from './configs/fiscalYears';
import configFunds from './configs/funds';
import configLedgers from './configs/ledgers';
import configGroups from './configs/groups';
import configTransactions from './configs/transactions';

export default function config() {
  configAcquisitionsUnits(this);
  configBudgets(this);
  configFiscalYears(this);
  configFunds(this);
  configLedgers(this);
  configGroups(this);
  configTransactions(this);
}
