import {
  collection,
  interactor,
  isPresent,
  Interactor,
} from '@bigtest/interactor';

import FinanceNavigationInteractor from '../common/FinanceNavigation';

export default interactor(class GroupsListInteractor {
  static defaultScope = '[data-test-groups-list]';

  groups = collection('[role=group] [role=row]');
  navigation = new FinanceNavigationInteractor();

  newGroupButton = new Interactor('#clickable-newGroup');

  isLoaded = isPresent('#groups-list');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
