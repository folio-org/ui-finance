import {
  Interactor,
  interactor,
  isPresent,
} from '@bigtest/interactor';
import Button from '../common/Button';

@interactor class AddTransferModal {
  static defaultScope = '#add-transfer-modal';
  cancelButton = new Button('[data-test-add-transfer-cancel]');
  saveButton = new Button('[data-test-add-transfer-save]');
  transferTo = new Interactor('select[name=toFundId]');
  transferFrom = new Interactor('select[name=fromFundId]');
  amount = new Interactor('input[name=amount]');
}

@interactor class Actions {
  static defaultScope = '#budget-actions';
  addTransferButton = new Interactor('[data-test-add-transfer-menu-button]');
}

export default interactor(class BudgetDetailsInteractor {
  static defaultScope = '#pane-budget';

  actions = new Actions();
  addTransferModal = new AddTransferModal();
  closePane = new Button('[icon=times]');

  isLoaded = isPresent('[class*=paneTitleLabel---]');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
