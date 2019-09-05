import {
  interactor,
  isPresent,
  collection,
  clickable,
  Interactor
} from '@bigtest/interactor';
import Button from '../common/Button';

@interactor class CurrentBudgetAccordion {
  static defaultScope = '#currentBudget';

  list = collection('[class*=mclRow---]', {
    link: clickable(),
  });
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

  currentBudget = new CurrentBudgetAccordion();
  addBudgetButton = new Button('[data-test-add-budget-button]');
  addBudgetModal = new AddBudgetModal();
  closePane = new Button('[icon=times]');

  isLoaded = isPresent('[class*=paneTitleLabel---]');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
