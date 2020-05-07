import {
  collection,
  interactor,
  isPresent,
  text,
} from '@bigtest/interactor';

export default interactor(class TransactionsListInteractor {
  static defaultScope = '[data-test-transactions-list]';

  transactions = collection('[class^="mclRow---"][role=row]', {
    rowText: text(),
  });

  isLoaded = isPresent('#transactions-list');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
