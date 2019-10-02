import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { FISCAL_YEAR_VIEW_ROUTE } from '../../../../../src/common/const';

import setupApplication from '../../../helpers/setup-application';
import FiscalYearFormInteractor from '../../../interactors/fiscalYear/FiscalYearForm';
import FiscalYearListInteractor from '../../../interactors/fiscalYear/FiscalYearList';
import FiscalYearDetailsInteractor from '../../../interactors/fiscalYear/FiscalYearDetails';

const TEST_VALUE_NAME = 'test edit name';

describe('Fiscal year edit', () => {
  setupApplication();

  const fiscalYearForm = new FiscalYearFormInteractor();
  const fiscalYearDetails = new FiscalYearDetailsInteractor();

  beforeEach(async function () {
    const fiscalYear = this.server.create('fiscalYear', {
      name: TEST_VALUE_NAME,
    });

    this.visit(`${FISCAL_YEAR_VIEW_ROUTE}${fiscalYear.id}`);
    await fiscalYearDetails.whenLoaded();
    await fiscalYearDetails.actions.editFiscalYear.click();
  });

  it('should display fiscal year form with values loaded from back-end', () => {
    expect(fiscalYearForm.nameValue).to.be.equal(TEST_VALUE_NAME);
  });

  describe('Save after edit', () => {
    const fiscalYearList = new FiscalYearListInteractor();

    beforeEach(async function () {
      await fiscalYearForm.name.fill('new name');

      await fiscalYearForm.saveButton.click();
      await fiscalYearList.whenLoaded();
    });

    it('should close form', () => {
      expect(fiscalYearForm.isPresent).to.be.false;
    });
  });
});
