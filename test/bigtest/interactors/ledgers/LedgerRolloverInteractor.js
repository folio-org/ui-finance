import {
  interactor,
  isPresent,
} from '@bigtest/interactor';

export default interactor(class LedgerRolloverInteractor {
  static defaultScope = '#pane-ledger-rollover-form';

  isLoaded = isPresent('[class*=paneTitleLabel---]');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
