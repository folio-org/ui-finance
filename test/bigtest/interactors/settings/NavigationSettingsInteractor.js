import {
  interactor,
  isPresent,
  clickable,
  property,
} from '@bigtest/interactor';

import { ButtonInteractor } from '@folio/stripes-acq-components/test/bigtest/interactors';

export default interactor(class NavigationSettingsInteractor {
  static defaultScope = '#navigation-settings';

  isLoaded = isPresent('#navigation-settings-form');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }

  description = isPresent('[class*="padding-bottom-gutter"]');
  enableBrowseTabLabel = isPresent('strong');
  enableBrowseTabCheckbox = clickable('input[type="checkbox"]');
  isCheckboxChecked = property('input[type="checkbox"]', 'checked');
  saveButton = new ButtonInteractor('button[class*="primary"]');
});

