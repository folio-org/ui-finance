import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import FundDetailsInteractor from '../../../interactors/funds/FundDetails';

describe('Funds details', () => {
  setupApplication();

  const fundDetails = new FundDetailsInteractor();

  beforeEach(async function () {
    const group = this.server.create('group');
    const ledger = this.server.create('ledger');
    const fiscalYear = this.server.create('fiscalYear', { id: ledger.id });
    const fund = this.server.create('fund', {
      groupIds: [group.id],
    });

    fund.fund.ledgerId = ledger.id;

    this.server.create('budget', {
      fundId: fund.id,
      fiscalYearId: fiscalYear.id,
    });

    this.visit(`/finance/fund/view/${fund.id}`);
    await fundDetails.whenLoaded();
  });

  it('shows fund details pane', () => {
    expect(fundDetails.isPresent).to.be.true;
  });

  describe('close fund details pane', () => {
    beforeEach(async function () {
      await fundDetails.closePane.click();
    });

    it('fund details pane is not presented', () => {
      expect(fundDetails.isPresent).to.be.false;
    });
  });

  describe('click on current budget', () => {
    beforeEach(async function () {
      await fundDetails.currentBudget.list(0).link();
    });

    it('redirects to current budget view page', () => {
      expect(fundDetails.isPresent).to.be.false;
    });
  });
});
