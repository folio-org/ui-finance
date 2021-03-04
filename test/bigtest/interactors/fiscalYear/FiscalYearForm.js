import {
  interactor,
  Interactor,
  isPresent,
  text,
  value,
} from '@bigtest/interactor';

import { TextFieldInteractor } from '@folio/stripes-acq-components/test/bigtest/interactors';

import Button from '../common/Button';

export default interactor(class FiscalYearFormInteractor {
  static defaultScope = '#pane-fiscal-year-form';
  isLoaded = isPresent('[class*=paneTitleLabel---]');

  saveButton = new Interactor('[data-test-save-button]');
  closePane = new Button('[icon=times]');

  name = new TextFieldInteractor('input[name="name"]');
  nameValue = value('input[name="name"]');
  code = new TextFieldInteractor('input[name="code"]');
  periodStart = new TextFieldInteractor('input[name="periodStart"]');
  periodEnd = new TextFieldInteractor('input[name="periodEnd"]');
  codeValidationMessage = text('[data-test-col-fy-form-code] [class*=feedbackError---]');

  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
