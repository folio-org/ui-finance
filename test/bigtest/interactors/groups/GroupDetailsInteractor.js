import {
  interactor,
  Interactor,
  isPresent,
  attribute,
  collection,
  text,
} from '@bigtest/interactor';
import Button from '../common/Button';

@interactor class GroupRemoveConfirmationModal {
  static defaultScope = '#group-remove-confirmation';

  removeButton = new Button('[data-test-confirmation-modal-confirm-button]')
}

@interactor class Actions {
  static defaultScope = '#group-details-actions';
  editGroup = new Interactor('[data-test-details-edit-action]');
  deleteGroup = new Interactor('[data-test-details-remove-action]');
}

@interactor class FundsAccordion {
  static defaultScope = '#fund';
  sortByNameButton = new Interactor('#fund #clickable-list-column-name');
  sortByCodeButton = new Interactor('#fund #clickable-list-column-code');
  funds = collection('#fund [data-row-inner]', { cells: collection('[role=gridcell]', { value: text() }) });
  whenLoaded() {
    return this.timeout(5000).when(() => isPresent('#fund #clickable-list-column-name'));
  }
}

export default interactor(class GroupDetailsInteractor {
  static defaultScope = '#pane-group-details';

  closePane = new Button('[icon=times]');
  actions = new Actions();
  groupRemoveConfirmationModal = new GroupRemoveConfirmationModal();
  fundsAccordion = new FundsAccordion();

  groupAllocatedValue = attribute(
    '[data-test-group-information-allocated]',
    'data-test-group-information-allocated',
  );

  isLoaded = isPresent('[class*=paneTitleLabel---]');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
