import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { LEDGERS_ROUTE } from '../../../../../src/common/const';

import setupApplication from '../../../helpers/setup-application';
import LedgerFormInteractor from '../../../interactors/ledgers/LedgerForm';
import LesdgersListInteractor from '../../../interactors/ledgers/LedgersList';
import FiscalYearFormInteractor from '../../../interactors/fiscalYear/FiscalYearForm';

const TEST_VALUE_NAME = 'test edit name';

describe('Ledger edit', () => {
  setupApplication();

  const ledgerForm = new LedgerFormInteractor();
  const ledgersList = new LesdgersListInteractor();

  beforeEach(async function () {
    const fiscalYear = this.server.create('fiscalYear');
    const ledger = this.server.create('ledger', {
      name: TEST_VALUE_NAME,
      fiscalYearOneId: fiscalYear.id,
    });

    this.visit(`${LEDGERS_ROUTE}/${ledger.id}/edit`);
    await ledgerForm.whenLoaded();
  });

  it('should display ledger form with values loaded from back-end', () => {
    expect(ledgerForm.nameValue).to.be.equal(TEST_VALUE_NAME);
  });

  describe('Save after edit', () => {
    beforeEach(async function () {
      await ledgerForm.name.fill('new name');

      await ledgerForm.saveButton.click();
      await ledgersList.whenLoaded();
    });

    it('should close form', () => {
      expect(ledgerForm.isPresent).to.be.false;
    });
  });

  describe('Click on create fiscal year button', () => {
    const fiscalYearForm = new FiscalYearFormInteractor();

    beforeEach(async function () {
      await ledgerForm.createFYButton.click();
      await fiscalYearForm.whenLoaded();
    });

    it('should close form', () => {
      expect(ledgerForm.isPresent).to.be.false;
    });

    it('should open fiscal year form', () => {
      expect(fiscalYearForm.isPresent).to.be.true;
    });
  });
});
