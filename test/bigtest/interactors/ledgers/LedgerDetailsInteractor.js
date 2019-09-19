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

export default interactor(class LedgerDetailsInteractor {
  static defaultScope = '#pane-ledger-details';

  closePane = new Button('[icon=times]');
  funds = new FundsAccordion();

  isLoaded = isPresent('[class*=paneTitleLabel---]');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
