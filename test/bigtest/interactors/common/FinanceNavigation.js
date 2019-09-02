import {
  interactor,
} from '@bigtest/interactor';

import ButtonInteractor from './Button';

export default interactor(class FinanceNavigationInteractor {
  static defaultScope = '[data-test-finance-navigation]';

  fiscalYearNavBtn = new ButtonInteractor('[data-test-finance-navigation-fiscalyear]');
  ledgersNavBtn = new ButtonInteractor('[data-test-finance-navigation-ledger]');
  fundsNavBtn = new ButtonInteractor('[data-test-finance-navigation-fund]');
  groupNavBtn = new ButtonInteractor('[data-test-finance-navigation-group]');
});
