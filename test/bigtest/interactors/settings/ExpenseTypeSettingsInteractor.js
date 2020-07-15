import {
  interactor,
  isPresent,
  collection,
} from '@bigtest/interactor';

import { ButtonInteractor } from '@folio/stripes-acq-components/test/bigtest/interactors';

export default interactor(class ExpenseTypeSettingsInteractor {
  static defaultScope = '#expenseTypes';

  expenseTypes = collection('[class^="editListRow---"]');
  addExpenseTypeBtn = new ButtonInteractor('#clickable-add-expenseTypes');

  isLoaded = isPresent('#editList-expenseTypes');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
