import {
  collection,
  interactor,
  isPresent,
} from '@bigtest/interactor';

import Button from '../common/Button';
import FinanceNavigationInteractor from '../common/FinanceNavigation';

export default interactor(class FundsListInteractor {
  static defaultScope = '[data-test-funds-list]';

  funds = collection('[data-row-inner]');
  navigation = new FinanceNavigationInteractor();
  newButton = new Button('#clickable-newFund');

  isLoaded = isPresent('#funds-list');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
