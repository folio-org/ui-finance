import {
  interactor,
  Interactor,
  isPresent,
} from '@bigtest/interactor';
import Button from '../common/Button';

@interactor class Actions {
  static defaultScope = '#fiscal-year-details-actions';
  editFiscalYear = new Interactor('[data-test-details-edit-action]');
}

export default interactor(class FiscalYearDetailsInteractor {
  static defaultScope = '#pane-fiscal-year-details';

  actions = new Actions();
  closePane = new Button('[icon=times]');

  isLoaded = isPresent('[class*=paneTitleLabel---]');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
