import configFunds from './configs/funds';
import configLedgers from './configs/ledgers';
import configFiscalYears from './configs/fiscalYears';
import configBudgets from './configs/budgets';

export default function config() {
  configFunds(this);
  configLedgers(this);
  configFiscalYears(this);
  configBudgets(this);
}
