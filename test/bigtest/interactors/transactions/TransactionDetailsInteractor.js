import {
  clickable,
  interactor,
  isPresent,
  text,
} from '@bigtest/interactor';
import Button from '../common/Button';

@interactor class Status {
  static defaultScope = '[data-test-transaction-status]';
  value = text('[data-test-transaction-status-value]');
}

@interactor class SourceLink {
  static defaultScope = '[data-testid="transaction-source-link"]';
  click = clickable();
}

export default interactor(class TransactionDetailsInteractor {
  static defaultScope = '#pane-transaction-details';

  closePane = new Button('[icon=times]');
  status = new Status();
  sourceLink = new SourceLink();

  isLoaded = isPresent('[class*=paneTitleLabel---]');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }

  whenDestroyed() {
    return this.timeout(5000).when(() => !this.isLoaded);
  }
});
