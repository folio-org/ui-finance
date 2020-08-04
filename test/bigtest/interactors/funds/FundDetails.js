import {
  interactor,
  Interactor,
  isPresent,
  collection,
  clickable,
} from '@bigtest/interactor';

import Button from '../common/Button';
import TagsAction from '../common/tags/TagsAction';

@interactor class Actions {
  static defaultScope = '#fund-details-actions';
  editFund = new Interactor('[data-test-details-edit-action]');
  deleteFund = new Interactor('[data-test-details-remove-action]');
  viewTransactions = new Interactor('[data-test-details-view-transactions-action]');
}

@interactor class CurrentBudgetAccordion {
  static defaultScope = '#currentBudget';

  list = collection('[class*=mclRow---]', {
    link: clickable(),
  });

  addBudgetButton = new Button('[data-test-add-current-budget-button]');
}

@interactor class PlannedBudgetAccordion {
  static defaultScope = '#plannedBudget';

  list = collection('[class*=mclRow---]', {
    link: clickable(),
  });

  addBudgetButton = new Button('[data-test-add-planned-budget-button]');
}

@interactor class FundRemoveConfirmationModal {
  static defaultScope = '#fund-remove-confirmation';

  removeButton = new Button('[data-test-confirmation-modal-confirm-button]')
}

@interactor class AddBudgetModal {
  static defaultScope = '#add-budget-modal';
  cancelButton = new Button('[data-test-add-budget-cancel]');
  saveButton = new Button('[data-test-add-budget-save]');
  fiscalYearId = new Interactor('select[name=fiscalYearId]');
  allowableExpenditure = new Interactor('input[name=allowableExpenditure]');
  allowableEncumbrance = new Interactor('input[name=allowableEncumbrance]');
  allocated = new Interactor('input[name=allocated]');
}

export default interactor(class FundDetailsInteractor {
  static defaultScope = '#pane-fund-details';

  actions = new Actions();
  currentBudget = new CurrentBudgetAccordion();
  plannedBudget = new PlannedBudgetAccordion();
  addBudgetModal = new AddBudgetModal();
  closePane = new Button('[icon=times]');
  fundRemoveConfirmationModal = new FundRemoveConfirmationModal();
  tagsAction = new TagsAction('[icon=tag]');
  fundExpenseClasses = isPresent('#fund-expense-classes');

  isLoaded = isPresent('[class*=paneTitleLabel---]');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
