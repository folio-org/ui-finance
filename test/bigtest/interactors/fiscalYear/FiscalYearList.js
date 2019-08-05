import {
  collection,
  interactor,
  isPresent,
} from '@bigtest/interactor';

import FinanceNavigationInteractor from '../common/FinanceNavigation';

export default interactor(class FiscalYearListInteractor {
  static defaultScope = '[data-test-fiscalyear-list]';

  fiscalYears = collection('[role=row] a');
  navigation = new FinanceNavigationInteractor();

  isLoaded = isPresent('#pane-results');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
