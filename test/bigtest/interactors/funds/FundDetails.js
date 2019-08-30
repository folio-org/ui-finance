import {
  interactor,
  isPresent,
  collection,
  clickable,
} from '@bigtest/interactor';
import Button from '../common/Button';

@interactor class CurrentBudgetAccordion {
  static defaultScope = '#currentBudget';

  list = collection('[class*=mclRow---]', {
    link: clickable(),
  });
}

export default interactor(class FundDetailsInteractor {
  static defaultScope = '#pane-fund-details';

  currentBudget = new CurrentBudgetAccordion();
  closePane = new Button('[icon=times]');

  isLoaded = isPresent('[class*=paneTitleLabel---]');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
