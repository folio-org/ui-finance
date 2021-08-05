import {
  Interactor,
  interactor,
  isPresent,
} from '@bigtest/interactor';

import {
  ButtonInteractor,
  ConfirmationInteractor,
} from '@folio/stripes-acq-components/test/bigtest/interactors';

import { SECTIONS_BUDGET } from '../../../../src/components/Budget/constants';

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
  addAllocationButton = new Interactor('[data-test-move-allocation-menu-button]');
  addTransferButton = new Interactor('[data-test-add-transfer-menu-button]');
  deleteBudgetButton = new Interactor('[data-test-budget-remove-action]');
  editBudgetButton = new Interactor('[data-test-edit-budget-button]');
}

export default interactor(class BudgetDetailsInteractor {
  static defaultScope = '#pane-budget';

  actions = new Actions();
  addTransferModal = new AddTransferModal();
  closePane = new ButtonInteractor('[icon=times]');
  budgetRemoveConfirmation = new ConfirmationInteractor('#budget-remove-confirmation');
  expenseClassesAccordion = isPresent(`#${SECTIONS_BUDGET.EXPENSE_CLASSES}`);

  isLoaded = isPresent('[class*=paneTitleLabel---]');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
