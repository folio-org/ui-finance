import {
  interactor,
  Interactor,
  isPresent,
  value,
} from '@bigtest/interactor';

import OptionListInteractor from '../common/OptionListInteractor';

@interactor class StatusInteractor {
  options = new OptionListInteractor('#sl-group-status');
}

export default interactor(class GroupFormInteractor {
  static defaultScope = '#pane-group-form';
  isLoaded = isPresent('[class*=paneTitleLabel---]');

  saveButton = new Interactor('[data-test-button-save-group]');

  name = new Interactor('input[name="name"]');
  nameValue = value('input[name="name"]');
  code = new Interactor('input[name="code"]');
  status = new StatusInteractor();

  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
