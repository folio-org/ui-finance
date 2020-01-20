import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import BudgetDetailsInteractor from '../../interactors/budgets/BudgetDetails';
import FundDetailsInteractor from '../../interactors/funds/FundDetails';

describe('Budget details', () => {
  setupApplication();

  const budgetDetails = new BudgetDetailsInteractor();
  const fundDetails = new FundDetailsInteractor();

  beforeEach(async function () {
    const ledger = this.server.create('ledger');
    const fund = this.server.create('fund');
    const fiscalYear = this.server.create('fiscalYear', { id: ledger.id });

    fund.fund.ledgerId = ledger.id;
    fund.fund.id = fund.id;

    const budget = this.server.create('budget', {
      fiscalYearId: fiscalYear.id,
      fundId: fund.fund.id,
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
