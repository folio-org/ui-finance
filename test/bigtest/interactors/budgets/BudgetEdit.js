import {
  interactor,
  isPresent,
} from '@bigtest/interactor';
import Button from '../common/Button';
import {
  NameField,
  ExpendedField,
  EncumberedField,
  AwaitingPaymentField,
} from './BudgetEditFields';

export default interactor(class BudgetEdit {
  static defaultScope = '#budget-edit-form';

  closePane = new Button('[icon=times]');

  updateBudget = new Button('[data-test-button-save-budget]');

  name = new NameField();
  expended = new ExpendedField();
  awaitingPayment = new AwaitingPaymentField();
  encumbered = new EncumberedField();

  isLoaded = isPresent('[class*=paneTitleLabel---]');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
