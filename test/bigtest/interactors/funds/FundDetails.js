import {
  interactor,
  Interactor,
  isPresent,
  collection,
  clickable,
} from '@bigtest/interactor';
import Button from '../common/Button';

@interactor class Actions {
  static defaultScope = '#fund-details-actions';
  editFund = new Interactor('[data-test-details-edit-action]');
}
@interactor class CurrentBudgetAccordion {
  static defaultScope = '#currentBudget';

  list = collection('[class*=mclRow---]', {
    link: clickable(),
  });
}

export default interactor(class FundDetailsInteractor {
  static defaultScope = '#pane-fund-details';

  actions = new Actions();
  currentBudget = new CurrentBudgetAccordion();
  closePane = new Button('[icon=times]');

  isLoaded = isPresent('[class*=paneTitleLabel---]');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
