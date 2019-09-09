import {
  interactor,
  isPresent,
} from '@bigtest/interactor';
import Button from '../common/Button';

export default interactor(class LedgerDetailsInteractor {
  static defaultScope = '#pane-ledger-details';

  closePane = new Button('[icon=times]');

  isLoaded = isPresent('[class*=paneTitleLabel---]');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
