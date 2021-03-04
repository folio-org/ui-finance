import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { FISCAL_YEAR_ROUTE } from '../../../../../src/common/const';

import setupApplication from '../../../helpers/setup-application';
import FiscalYearFormInteractor from '../../../interactors/fiscalYear/FiscalYearForm';
import FiscalYearListInteractor from '../../../interactors/fiscalYear/FiscalYearList';

describe('Fiscal year create form', () => {
  setupApplication();

  const fiscalYearForm = new FiscalYearFormInteractor();
  const fiscalYearList = new FiscalYearListInteractor();

  beforeEach(async function () {
    this.server.createList('fiscalYear', 2);
    this.visit(FISCAL_YEAR_ROUTE);
    await fiscalYearList.whenLoaded();
    await fiscalYearList.newButton.click();
  });

  it('displays create fiscal year form', () => {
    expect(fiscalYearForm.isPresent).to.be.true;
  });

  describe('close fiscal year form', () => {
    beforeEach(async function () {
      await fiscalYearForm.closePane.click();
    });

    it('closes fiscal year form', () => {
      expect(fiscalYearForm.isPresent).to.be.false;
      expect(fiscalYearList.isPresent).to.be.true;
    });
  });

  describe('create new fiscal year form', () => {
    beforeEach(async function () {
      await fiscalYearForm.code.fillAndBlur('Tes code');
      await fiscalYearForm.name.fillAndBlur('Test name');
      await fiscalYearForm.periodStart.fillAndBlur('2019-01-01');
      await fiscalYearForm.periodEnd.fillAndBlur('2019-12-31');
      await fiscalYearForm.saveButton.click();
    });

    // it('save fiscal year form', () => {
    //   expect(fiscalYearForm.isPresent).to.be.false;
    //   expect(fiscalYearList.isPresent).to.be.true;
    // });
  });
});
