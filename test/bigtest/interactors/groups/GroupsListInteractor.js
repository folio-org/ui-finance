import {
  collection,
  interactor,
  isPresent,
  Interactor,
} from '@bigtest/interactor';

import FinanceNavigationInteractor from '../common/FinanceNavigation';

export default interactor(class GroupsListInteractor {
  static defaultScope = '[data-test-groups-list]';

  groups = collection('[role=row] a');
  navigation = new FinanceNavigationInteractor();

  newGroupButton = new Interactor('#clickable-newgroup');

  isLoaded = isPresent('#pane-results');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
