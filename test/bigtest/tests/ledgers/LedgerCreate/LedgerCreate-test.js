import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { LEDGERS_ROUTE } from '../../../../../src/common/const';

import setupApplication from '../../../helpers/setup-application';
import LedgerFormInteractor from '../../../interactors/ledgers/LedgerForm';
import LedgersListInteractor from '../../../interactors/ledgers/LedgersList';

describe('Ledger create', () => {
  setupApplication();

  const ledgerForm = new LedgerFormInteractor();
  const ledgersList = new LedgersListInteractor();

  beforeEach(async function () {
    this.server.createList('ledger', 2);
    this.visit(LEDGERS_ROUTE);
    await ledgersList.whenLoaded();
    await ledgersList.newButton.click();
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
      expect(ledgersList.isPresent).to.be.true;
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
      await ledgerForm.status.options.list(1).click();

      await ledgerForm.saveButton.click();
      await ledgersList.whenLoaded();
    });

    it('should close ledger form and display the list of ledgers', () => {
      expect(ledgersList.isPresent).to.be.true;
    });
  });

  describe('Click on create fiscal year button', () => {
    beforeEach(async function () {
      await ledgerForm.createFYButton.click();
    });

    it('should  close form', () => {
      expect(ledgerForm.isPresent).to.be.false;
    });
  });
});
