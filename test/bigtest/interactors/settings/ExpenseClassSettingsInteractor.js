import {
  interactor,
  isPresent,
  collection,
} from '@bigtest/interactor';

import { ButtonInteractor } from '@folio/stripes-acq-components/test/bigtest/interactors';

export default interactor(class ExpenseClassSettingsInteractor {
  static defaultScope = '#expenseClasses';

  expenseClasses = collection('[class^="editListRow---"]');
  addExpenseClassBtn = new ButtonInteractor('#clickable-add-expenseClasses');

  isLoaded = isPresent('#editList-expenseClasses');
  whenLoaded() {
    return this.when(() => this.isLoaded);
  }
});
