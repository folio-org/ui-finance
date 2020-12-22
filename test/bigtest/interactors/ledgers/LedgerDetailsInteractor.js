import {
  clickable,
  text,
  collection,
  interactor,
  isPresent,
} from '@bigtest/interactor';
import Button from '../common/Button';

@interactor class FundsAccordion {
  static defaultScope = '#fund';

  list = collection('[class*=mclRow---]', {
    link: clickable(),
    values: collection('[class*=mclCell---]', {
      value: text(),
    }),
  });
}

@interactor class GroupsAccordion {
  static defaultScope = '#group';

  list = collection('[class*=mclRow---]', {
    link: clickable(),
    values: collection('[class*=mclCell---]', {
      value: text(),
    }),
  });
}

export default interactor(class LedgerDetailsInteractor {
  static defaultScope = '#pane-ledger-details';

  closePane = new Button('[data-test-pane-header-dismiss-button]');
  funds = new FundsAccordion();
  groups = new GroupsAccordion();
  actions = new Button('[data-pane-header-actions-dropdown]');
  rollover = new Button('[data-test-ledger-rollover-action]');

  isLoaded = isPresent('[class*=paneTitleLabel---]');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
