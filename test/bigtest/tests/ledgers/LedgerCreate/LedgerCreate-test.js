import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { LEDGER_CREATE_ROUTE } from '../../../../../src/common/const';

import setupApplication from '../../../helpers/setup-application';
import LedgerFormInteractor from '../../../interactors/ledgers/LedgerForm';
import FiscalYearFormInteractor from '../../../interactors/fiscalYear/FiscalYearForm';

describe('Ledger create', () => {
  setupApplication();

  const ledgerForm = new LedgerFormInteractor();

  beforeEach(async function () {
    this.server.create('fiscalYear', {
      code: 'FY',
    });
    this.visit(LEDGER_CREATE_ROUTE);
    await ledgerForm.whenLoaded();
  });

  it('should display create ledger form', () => {
    expect(ledgerForm.isPresent).to.be.true;
  });

  describe('close ledger form', () => {
    beforeEach(async function () {
      await ledgerForm.closePane.click();
    });

    it('closes ledger form', () => {
      expect(ledgerForm.isPresent).to.be.false;
    });
  });

  describe('Save not filled (missed requried) form', () => {
    beforeEach(async function () {
      await ledgerForm.name.fill('test name');
      await ledgerForm.saveButton.click();
    });

    it('should not close form', () => {
      expect(ledgerForm.isPresent).to.be.true;
    });
  });

  describe('Save form with all required fields', () => {
    beforeEach(async function () {
      await ledgerForm.name.fill('Test Ledger');
      await ledgerForm.code.fill('LDGR');
      await ledgerForm.fyOneList.selectOption('FY');
      await ledgerForm.saveButton.click();
    });

    it('should close ledger form', () => {
      expect(ledgerForm.isPresent).to.be.false;
    });
  });

  describe('Click on create fiscal year button', () => {
    const fiscalYearForm = new FiscalYearFormInteractor();

    beforeEach(async function () {
      await ledgerForm.createFYButton.click();
      await fiscalYearForm.whenLoaded();
    });

    it('should  close form', () => {
      expect(ledgerForm.isPresent).to.be.false;
    });

    it('should open fiscal year form', () => {
      expect(fiscalYearForm.isPresent).to.be.true;
    });
  });
});
