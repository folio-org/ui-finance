import {
  interactor,
  Interactor,
  isPresent,
  value,
} from '@bigtest/interactor';

import Button from '../common/Button';

export default interactor(class FiscalYearFormInteractor {
  static defaultScope = '#pane-fiscal-year-form';
  isLoaded = isPresent('[class*=paneTitleLabel---]');

  saveButton = new Interactor('[data-test-save-button]');
  closePane = new Button('[icon=times]');

  name = new Interactor('input[name="name"]');
  nameValue = value('input[name="name"]');
  code = new Interactor('input[name="code"]');
  periodStart = new Interactor('input[name="periodStart"]');
  periodEnd = new Interactor('input[name="periodEnd"]');

  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
