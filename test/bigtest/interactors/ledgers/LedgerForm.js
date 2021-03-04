import {
  interactor,
  Interactor,
  isPresent,
  text,
  value,
} from '@bigtest/interactor';
import {
  SelectInteractor,
  TextFieldInteractor,
} from '@folio/stripes-acq-components/test/bigtest/interactors';
import Button from '../common/Button';
import OptionListInteractor from '../common/OptionListInteractor';

@interactor class StatusInteractor {
  options = new OptionListInteractor('#sl-ledger-status');
}

export default interactor(class LedgerFormInteractor {
  static defaultScope = '#pane-ledger-form';
  isLoaded = isPresent('[class*=paneTitleLabel---]');

  saveButton = new Interactor('[data-test-save-button]');
  createFYButton = new Button('[data-test-ledger-create-fy]');
  closePane = new Button('[icon=times]');

  name = new TextFieldInteractor('input[name="name"]');
  nameValue = value('input[name="name"]');
  code = new TextFieldInteractor('input[name="code"]');
  status = new StatusInteractor();
  fyOneList = new SelectInteractor('[data-test-col-ledger-form-fy]');
  codeValidationMessage = text('[data-test-col-ledger-form-code] [class*=feedbackError---]');

  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
