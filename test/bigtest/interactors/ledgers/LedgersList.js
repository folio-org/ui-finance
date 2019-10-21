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

  ledgers = collection('[role=row] a');
  navigation = new FinanceNavigationInteractor();
  newButton = new Button('#clickable-newledger');
  isNoResultsMessageLabelPresent = isPresent('[class*=noResultsMessageLabel]');
  fillSearchField = fillable('#input-ledger-search');
  clickSearch = clickable('[data-test-search-and-sort-submit]');
  isLoaded = isPresent('#pane-results');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
