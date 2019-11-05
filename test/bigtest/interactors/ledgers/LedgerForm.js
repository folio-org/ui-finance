import {
  interactor,
  Interactor,
  isPresent,
  value,
} from '@bigtest/interactor';

import Button from '../common/Button';
import OptionListInteractor from '../common/OptionListInteractor';

@interactor class StatusInteractor {
  options = new OptionListInteractor('#sl-ledger-status');
}

export default interactor(class LedgerFormInteractor {
  static defaultScope = '#pane-ledger-form';
  isLoaded = isPresent('[class*=paneTitleLabel---]');

  saveButton = new Interactor('[data-test-button-save-ledger]');
  createFYButton = new Button('[data-test-ledger-create-fy]');
  closePane = new Button('[icon=times]');

  name = new Interactor('input[name="name"]');
  nameValue = value('input[name="name"]');
  code = new Interactor('input[name="code"]');
  status = new StatusInteractor();

  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
