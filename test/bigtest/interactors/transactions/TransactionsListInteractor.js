import {
  collection,
  interactor,
  isPresent,
  text,
} from '@bigtest/interactor';

import { ButtonInteractor } from '@folio/stripes-acq-components/test/bigtest/interactors';

export default interactor(class TransactionsListInteractor {
  static defaultScope = '[data-test-transactions-list]';

  transactions = collection('[class^="mclRow---"][data-row-inner]', {
    rowText: text(),
  });

  closePane = new ButtonInteractor('[icon=times]');

  isLoaded = isPresent('#transactions-list');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
