import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import NavigationSettingsInteractor from '../../../interactors/settings/NavigationSettingsInteractor';

describe('Setting - Navigation', function () {
  setupApplication();

  const navigationSettings = new NavigationSettingsInteractor();

  beforeEach(async function () {
    this.visit('/settings/finance/navigation');
    await navigationSettings.whenLoaded();
  });

  it('should be rendered', () => {
    expect(navigationSettings.isPresent).to.be.true;
    expect(navigationSettings.description).to.be.true;
    expect(navigationSettings.enableBrowseTabLabel).to.be.true;
    expect(navigationSettings.enableBrowseTabCheckbox.isPresent).to.be.true;
    expect(navigationSettings.saveButton.isPresent).to.be.true;
  });

  it('should have checkbox unchecked by default', () => {
    expect(navigationSettings.isCheckboxChecked).to.be.false;
  });

  it('should enable save button when checkbox is toggled', async () => {
    expect(navigationSettings.saveButton.isDisabled).to.be.true;

    await navigationSettings.enableBrowseTabCheckbox.click();

    expect(navigationSettings.isCheckboxChecked).to.be.true;
    expect(navigationSettings.saveButton.isDisabled).to.be.false;
  });

  it('should disable save button initially', () => {
    expect(navigationSettings.saveButton.isDisabled).to.be.true;
  });
});



