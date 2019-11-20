import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import FundTypesSettingsInteractor from '../../../interactors/settings/FundTypesSettingsInteractor';

const FUND_TYPES_COUNT = 40;

describe('Setting - Fund types', function () {
  setupApplication();

  const fundTypesSettings = new FundTypesSettingsInteractor();

  beforeEach(async function () {
    this.server.createList('fundType', FUND_TYPES_COUNT);

    this.visit('/settings/finance/fund-types');
    await fundTypesSettings.whenLoaded();
  });

  it('should be rendered', () => {
    expect(fundTypesSettings.isPresent).to.be.true;
    expect(fundTypesSettings.addFundTypeBtn.isPresent).to.be.true;
  });

  it('should display a row all fund types', () => {
    expect(fundTypesSettings.fundTypes().length).to.be.equal(FUND_TYPES_COUNT);
  });
});
