import {
  interactor,
  isPresent,
  collection,
} from '@bigtest/interactor';

import { ButtonInteractor } from '@folio/stripes-acq-components/test/bigtest/interactors';

export default interactor(class FundTypesSettingsInteractor {
  static defaultScope = '#fundTypes';

  fundTypes = collection('[class^="editListRow---"]');
  addFundTypeBtn = new ButtonInteractor('#clickable-add-fundTypes');

  isLoaded = isPresent('#editList-fundTypes');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
