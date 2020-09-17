import {
  collection,
  interactor,
  isPresent,
} from '@bigtest/interactor';

import {
  ButtonInteractor,
  TextFieldInteractor,
} from '@folio/stripes-acq-components/test/bigtest/interactors';

import { SECTIONS_BUDGET } from '../../../../src/components/Budget/constants';

@interactor class BudgetExpenseClassesAccordion {
  static defaultScope = `#${SECTIONS_BUDGET.EXPENSE_CLASSES}`;
  addExpenseClassButton = new ButtonInteractor('#budget-status-expense-classes-add-button');
  expenseClasses = collection('[data-test-repeatable-field-list] [data-test-repeatable-field-list-item-labels]');
}

export default interactor(class BudgetEdit {
  static defaultScope = '#budget-edit-form';

  closePane = new ButtonInteractor('[icon=times]');

  updateBudget = new ButtonInteractor('[data-test-save-button]');

  name = new TextFieldInteractor('input[name="name"]');
  budgetExpenseClassesAccordion = new BudgetExpenseClassesAccordion();

  isLoaded = isPresent('[class*=paneTitleLabel---]');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
