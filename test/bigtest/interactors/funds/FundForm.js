import {
  interactor,
  isPresent,
} from '@bigtest/interactor';
import { TextFieldInteractor } from '@folio/stripes-acq-components/test/bigtest/interactors';

import Button from '../common/Button';

export default interactor(class FundFormInteractor {
  static defaultScope = '#pane-fund-form';

  closePane = new Button('[icon=times]');
  externalAccountNo = new TextFieldInteractor('input[name="externalAccountNo"]');
  description = new TextFieldInteractor('[name="description"]');
  saveButton = new Button('[data-test-button-save-fund]');

  isLoaded = isPresent('[class*=paneTitleLabel---]');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
