import {
  interactor,
  isPresent,
  is,
  property,
  collection,
  clickable,
} from '@bigtest/interactor';
import Button from '../common/Button';

export default interactor(class BudgetDetails {
  static defaultScope = '#pane-budget';

  closePane = new Button('[icon=times]');

  isLoaded = isPresent('[class*=paneTitleLabel---]');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
