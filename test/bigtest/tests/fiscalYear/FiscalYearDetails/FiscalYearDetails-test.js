import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { FISCAL_YEAR_ROUTE } from '../../../../../src/common/const';

import setupApplication from '../../../helpers/setup-application';
import FiscalYearDetailsInteractor from '../../../interactors/fiscalYear/FiscalYearDetails';

describe('Fiscal year details', () => {
  setupApplication();

  const fiscalYearDetails = new FiscalYearDetailsInteractor();

  beforeEach(async function () {
    const fiscalYear = this.server.create('fiscalYear');

    this.visit(`${FISCAL_YEAR_ROUTE}/${fiscalYear.id}/view`);
    await fiscalYearDetails.whenLoaded();
  });

  it('shows fiscal year details pane', () => {
    expect(fiscalYearDetails.isPresent).to.be.true;
  });

  describe('close fiscal year details pane', () => {
    beforeEach(async function () {
      await fiscalYearDetails.closePane.click();
    });

    it('fiscal year details pane is not presented', () => {
      expect(fiscalYearDetails.isPresent).to.be.false;
    });
  });
});
