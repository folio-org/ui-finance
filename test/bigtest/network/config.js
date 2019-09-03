import configAcquisitionsUnits from './configs/acquisitionsUnits';
import configBudgets from './configs/budgets';
import configFiscalYears from './configs/fiscalYears';
import configFunds from './configs/funds';
import configLedgers from './configs/ledgers';

export default function config() {
  configAcquisitionsUnits(this);
  configBudgets(this);
  configFiscalYears(this);
  configFunds(this);
  configLedgers(this);
}
