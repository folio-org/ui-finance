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
    const fiscalYear = this.server.create('fiscalYear', { id: ledger.id });

    const funds = this.server.createList('fund', 5, {
      ledgerId: ledger.id,
    });

    this.server.create('groupFundFiscalYear', {
      fiscalYearId: fiscalYear.id,
      ledgerId: ledger.id,
      fundId: funds[0].id,
      available: 1000,
    });

    this.visit(`${LEDGER_VIEW_ROUTE}${ledger.id}`);
    await ledgerDetails.whenLoaded();
  });

  it('should show details pane', () => {
    expect(ledgerDetails.isPresent).to.be.true;
  });

  it('funds list should be display', () => {
    expect(ledgerDetails.funds.list().length).to.be.equal(1);
  });

  it('fund unavaliable value should be equal $1,000.00', () => {
    expect(ledgerDetails.funds.list(0).values(4).value).to.be.equal('$1,000.00');
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
