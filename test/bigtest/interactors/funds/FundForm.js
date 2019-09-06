import {
  interactor,
  isPresent,
  fillable,
} from '@bigtest/interactor';

import Button from '../common/Button';

export default interactor(class FundFormInteractor {
  static defaultScope = '#pane-fund-form';

  closePane = new Button('[icon=times]');
  externalAccountNo = fillable('input[name="externalAccountNo"]');
  saveButton = new Button('[data-test-button-save-fund]');


  isLoaded = isPresent('[class*=paneTitleLabel---]');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
