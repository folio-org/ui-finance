import {
  collection,
  interactor,
  isPresent,
} from '@bigtest/interactor';

import FinanceNavigationInteractor from '../common/FinanceNavigation';

export default interactor(class FundsListInteractor {
  static defaultScope = '[data-test-funds-list]';

  funds = collection('[role=row] a');
  navigation = new FinanceNavigationInteractor();

  isLoaded = isPresent('#pane-results');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
