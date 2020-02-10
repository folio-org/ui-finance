import {
  clickable,
  collection,
  fillable,
  interactor,
  isPresent,
} from '@bigtest/interactor';

import Button from '../common/Button';
import FinanceNavigationInteractor from '../common/FinanceNavigation';

export default interactor(class LedgersListInteractor {
  static defaultScope = '[data-test-ledgers-list]';

  ledgers = collection('[role=group] [role=row]');
  navigation = new FinanceNavigationInteractor();
  newButton = new Button('#clickable-newLedger');
  fillSearchField = fillable('[data-test-single-search-form] input');
  clickSearch = clickable('[data-test-single-search-form] button');
  isLoaded = isPresent('#ledgers-list');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
