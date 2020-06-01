import {
  collection,
  interactor,
  isPresent,
  Interactor,
} from '@bigtest/interactor';

import FinanceNavigationInteractor from '../common/FinanceNavigation';

export default interactor(class GroupsListInteractor {
  static defaultScope = '[data-test-groups-list]';

  groups = collection('[data-row-inner]');
  navigation = new FinanceNavigationInteractor();

  newGroupButton = new Interactor('#clickable-newGroup');

  isLoaded = isPresent('#groups-list');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
