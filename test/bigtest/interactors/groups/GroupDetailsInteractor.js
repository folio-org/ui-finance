import {
  interactor,
  Interactor,
  isPresent,
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

export default interactor(class GroupDetailsInteractor {
  static defaultScope = '#pane-group-details';

  closePane = new Button('[icon=times]');
  actions = new Actions();
  groupRemoveConfirmationModal = new GroupRemoveConfirmationModal();

  isLoaded = isPresent('[class*=paneTitleLabel---]');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
