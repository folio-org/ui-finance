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

export default interactor(class BudgetDetailsInteractor {
  static defaultScope = '#pane-budget';

  addTransferButton = new Button('[data-test-add-transfer-button]');
  addTransferModal = new AddTransferModal();
  closePane = new Button('[icon=times]');

  isLoaded = isPresent('[class*=paneTitleLabel---]');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
