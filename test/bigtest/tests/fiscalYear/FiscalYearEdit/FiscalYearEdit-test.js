import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { FISCAL_YEAR_ROUTE } from '../../../../../src/common/const';

import setupApplication from '../../../helpers/setup-application';
import FiscalYearFormInteractor from '../../../interactors/fiscalYear/FiscalYearForm';
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

    this.visit(`${FISCAL_YEAR_ROUTE}/${fiscalYear.id}/view`);
    await fiscalYearDetails.whenLoaded();
    await fiscalYearDetails.actions.editFiscalYear.click();
  });

  it('should display fiscal year form with values loaded from back-end', () => {
    expect(fiscalYearForm.nameValue).to.be.equal(TEST_VALUE_NAME);
  });

  describe('Save after edit', () => {
    beforeEach(async function () {
      await fiscalYearForm.name.fill('new name');
      await fiscalYearForm.saveButton.click();
    });

    it('should close form', () => {
      expect(fiscalYearForm.isPresent).to.be.false;
    });
  });
});
