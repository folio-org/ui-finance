import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { LEDGER_EDIT_ROUTE } from '../../../../../src/common/const';

import setupApplication from '../../../helpers/setup-application';
import LedgerFormInteractor from '../../../interactors/ledgers/LedgerForm';
import LesdgersListInteractor from '../../../interactors/ledgers/LedgersList';

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

    this.visit(`${LEDGER_EDIT_ROUTE}${ledger.id}`);
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
    beforeEach(async function () {
      await ledgerForm.createFYButton.click();
    });

    it('should close form', () => {
      expect(ledgerForm.isPresent).to.be.false;
    });
  });
});
