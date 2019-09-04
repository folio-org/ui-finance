import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import BudgetEdetailsInteractor from '../../interactors/budgets/BudgetDetails';

describe('Budget details', () => {
  setupApplication();

  const budgetDetails = new BudgetEdetailsInteractor();

  beforeEach(async function () {
    const fund = this.server.create('budget');

    const budget = this.server.create('budget', {
      fundId: fund.id,
    });

    this.visit(`finance/budget/${budget.id}/view`);
    await budgetDetails.whenLoaded();
  });

  it('shows budget details', () => {
    expect(budgetDetails.isPresent).to.be.true;
  });
});
