import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { LEDGERS_ROUTE } from '../../../../../src/common/const';

import setupApplication from '../../../helpers/setup-application';
import LedgerDetailsInteractor from '../../../interactors/ledgers/LedgerDetailsInteractor';
import FundDetailsInteractor from '../../../interactors/funds/FundDetails';
import LedgerRolloverInteractor from '../../../interactors/ledgers/LedgerRolloverInteractor';

describe('Ledger details', () => {
  setupApplication();

  const ledgerDetails = new LedgerDetailsInteractor();
  const fundDetails = new FundDetailsInteractor();
  const rollover = new LedgerRolloverInteractor();

  beforeEach(async function () {
    const ledger = this.server.create('ledger');
    const fiscalYear = this.server.create('fiscalYear', { id: ledger.id });
    const group = this.server.create('group');

    const funds = this.server.createList('fund', 5, {
      fund: {
        ledgerId: ledger.id,
        id() {
          return Math.random();
        },
        fundStatus: 'Active',
        name: 'test fund',
        code: 'TEST_CODE',
      },
      groupIds: [group.id],
    });

    const budget = this.server.create('budget', {
      fiscalYearId: fiscalYear.id,
      fundId: funds[0].id,
      available: 1000,
    });

    this.server.create('groupFundFiscalYear', {
      budgetId: budget.id,
      fundId: funds[0].id,
      groupId: group.id,
      fiscalYearId: fiscalYear.id,
    });

    this.visit(`${LEDGERS_ROUTE}/${ledger.id}/view`);
    await ledgerDetails.whenLoaded();
  });

  it('should show details pane', () => {
    expect(ledgerDetails.isPresent).to.be.true;
  });

  it('funds list should be display', () => {
    expect(ledgerDetails.funds.list().length).to.be.equal(1);
  });

  it('fund unavailable value should be equal $1,000.00', () => {
    expect(ledgerDetails.funds.list(0).values(4).value).to.be.equal('$1,000.00');
  });

  describe('click on fund', () => {
    beforeEach(async function () {
      await ledgerDetails.funds.list(0).link();
    });

    it('redirects to selected fund view page', () => {
      expect(fundDetails.isPresent).to.be.true;
    });
  });

  describe('click on group', () => {
    beforeEach(async function () {
      await ledgerDetails.groups.list(0).link();
    });

    it('redirects to selected group view page', () => {
      expect(ledgerDetails.isPresent).to.be.false;
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

  describe('click on rollover', () => {
    beforeEach(async function () {
      await ledgerDetails.actions.click();
      await ledgerDetails.rollover.focus();
      await ledgerDetails.rollover.click();
      await rollover.whenLoaded();
    });

    it('goes to ledger rollover', () => {
      expect(rollover.isPresent).to.be.true;
    });
  });
});
