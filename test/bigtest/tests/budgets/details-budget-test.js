import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import BudgetEdetailsInteractor from '../../interactors/budgets/BudgetDetails';
import FundDetailsInteractor from '../../interactors/funds/FundDetails';

describe('Budget details', () => {
  setupApplication();

  const budgetDetails = new BudgetEdetailsInteractor();
  const fundDetails = new FundDetailsInteractor();

  beforeEach(async function () {
    const ledger = this.server.create('ledger');
    const fund = this.server.create('fund');

    fund.fund.ledgerId = ledger.id;

    const budget = this.server.create('budget', {
      fundId: fund.id,
    });

    this.visit(`finance/budget/${budget.id}/view`);
    await budgetDetails.whenLoaded();
  });

  it('shows budget details', () => {
    expect(budgetDetails.isPresent).to.be.true;
  });

  describe('close budget details', () => {
    beforeEach(async function () {
      await budgetDetails.closePane.click();
    });

    it('closes budget details', () => {
      expect(budgetDetails.isPresent).to.be.false;
      expect(fundDetails.isPresent).to.be.true;
    });
  });
});
