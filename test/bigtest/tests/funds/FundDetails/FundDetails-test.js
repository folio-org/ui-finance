import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import FundDetailsInteractor from '../../../interactors/funds/FundDetails';
import BudgetDetailsInteractor from '../../../interactors/budgets/BudgetDetails';

describe('Funds details', () => {
  setupApplication();

  const fundDetails = new FundDetailsInteractor();
  const budgetDetails = new BudgetDetailsInteractor();

  beforeEach(async function () {
    const fund = this.server.create('fund');

    this.server.create('budget', {
      fundId: fund.id,
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

    it('redirects to selected budget view page', () => {
      expect(budgetDetails.isPresent).to.be.false;
    });
  });
});
