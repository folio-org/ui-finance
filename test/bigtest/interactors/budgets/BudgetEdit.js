import {
  collection,
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
import { SECTIONS_BUDGET } from '../../../../src/components/Budget/constants';

@interactor class BudgetExpenseClassesAccordion {
  static defaultScope = `#${SECTIONS_BUDGET.EXPENSE_CLASSES}`;
  addExpenseClassButton = new Button('#budget-status-expense-classes-add-button');
  expenseClasses = collection('[data-test-repeatable-field-list] [data-test-repeatable-field-list-item-labels]');
}

export default interactor(class BudgetEdit {
  static defaultScope = '#budget-edit-form';

  closePane = new Button('[icon=times]');

  updateBudget = new Button('[data-test-save-button]');

  name = new NameField();
  expended = new ExpendedField();
  awaitingPayment = new AwaitingPaymentField();
  encumbered = new EncumberedField();
  budgetExpenseClassesAccordion = new BudgetExpenseClassesAccordion();

  isLoaded = isPresent('[class*=paneTitleLabel---]');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
