import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { LEDGERS_ROUTE } from '../../../../../src/common/const';

import setupApplication from '../../../helpers/setup-application';
import LedgerFormInteractor from '../../../interactors/ledgers/LedgerForm';
import FiscalYearFormInteractor from '../../../interactors/fiscalYear/FiscalYearForm';

const TEST_VALUE_NAME = 'test edit name';
const TEST_CODE = 'ledger test code';

describe('Ledger edit', () => {
  setupApplication();

  const ledgerForm = new LedgerFormInteractor();

  beforeEach(async function () {
    const fiscalYear = this.server.create('fiscalYear');
    const ledger = this.server.create('ledger', {
      name: TEST_VALUE_NAME,
      fiscalYearOneId: fiscalYear.id,
    });

    this.server.create('ledger', { code: TEST_CODE });

    this.visit(`${LEDGERS_ROUTE}/${ledger.id}/edit`);
    await ledgerForm.whenLoaded();
  });

  it('should display ledger form with values loaded from back-end', () => {
    expect(ledgerForm.nameValue).to.be.equal(TEST_VALUE_NAME);
  });

  describe('attemption to save with code that is already in use', () => {
    beforeEach(async function () {
      await ledgerForm.name.fill('new name');
      await ledgerForm.code.fill(TEST_CODE);

      await ledgerForm.saveButton.click();
    });

    it('should stay on form with error message that code is already in use', () => {
      expect(ledgerForm.isPresent).to.be.true;
      expect(ledgerForm.codeValidationMessage).to.be.equal('This Ledger code is already in use.');
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
