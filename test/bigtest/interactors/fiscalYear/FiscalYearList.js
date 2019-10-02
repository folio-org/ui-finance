import {
  collection,
  interactor,
  isPresent,
} from '@bigtest/interactor';

import Button from '../common/Button';
import FinanceNavigationInteractor from '../common/FinanceNavigation';

export default interactor(class FiscalYearListInteractor {
  static defaultScope = '[data-test-fiscal-years-list]';

  fiscalYears = collection('[role=row] a');
  navigation = new FinanceNavigationInteractor();
  newButton = new Button('#clickable-newfiscalYear');

  isLoaded = isPresent('#pane-results');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
