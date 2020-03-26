import {
  Interactor,
  interactor,
  isPresent,
} from '@bigtest/interactor';

import {
  ButtonInteractor,
  ConfirmationInteractor,
} from '@folio/stripes-acq-components/test/bigtest/interactors';

@interactor class AddTransferModal {
  static defaultScope = '#add-transfer-modal';
  cancelButton = new ButtonInteractor('[data-test-add-transfer-cancel]');
  saveButton = new ButtonInteractor('[data-test-add-transfer-save]');
  transferTo = new Interactor('select[name=toFundId]');
  transferFrom = new Interactor('select[name=fromFundId]');
  amount = new Interactor('input[name=amount]');
}

@interactor class Actions {
  static defaultScope = '#budget-actions';
  addTransferButton = new Interactor('[data-test-add-transfer-menu-button]');
  deleteBudgetButton = new Interactor('[data-test-budget-remove-action]');
}

export default interactor(class BudgetDetailsInteractor {
  static defaultScope = '#pane-budget';

  actions = new Actions();
  addTransferModal = new AddTransferModal();
  closePane = new ButtonInteractor('[icon=times]');
  budgetRemoveConfirmation = new ConfirmationInteractor('#budget-remove-confirmation');

  isLoaded = isPresent('[class*=paneTitleLabel---]');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
