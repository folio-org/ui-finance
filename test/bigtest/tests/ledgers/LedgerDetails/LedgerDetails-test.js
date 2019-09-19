import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { LEDGER_VIEW_ROUTE } from '../../../../../src/common/const';

import setupApplication from '../../../helpers/setup-application';
import LedgerDetailsInteractor from '../../../interactors/ledgers/LedgerDetailsInteractor';
import FundDetailsInteractor from '../../../interactors/funds/FundDetails';

describe('Ledger details', () => {
  setupApplication();

  const ledgerDetails = new LedgerDetailsInteractor();
  const fundDetails = new FundDetailsInteractor();

  beforeEach(async function () {
    const ledger = this.server.create('ledger');

    this.server.createList('fund', 5, {
      ledgerId: ledger.id,
    });

    this.visit(`${LEDGER_VIEW_ROUTE}${ledger.id}`);
    await ledgerDetails.whenLoaded();
  });

  it('should show details pane', () => {
    expect(ledgerDetails.isPresent).to.be.true;
  });

  describe('click on fund', () => {
    beforeEach(async function () {
      await ledgerDetails.funds.list(0).link();
    });

    it('redirects to selected fund view page', () => {
      expect(fundDetails.isPresent).to.be.false;
    });
  });

  describe('close action', () => {
    beforeEach(async function () {
      await ledgerDetails.closePane.click();
    });

    it('should close details pane', () => {
      expect(ledgerDetails.isPresent).to.be.false;
    });
  });
});
