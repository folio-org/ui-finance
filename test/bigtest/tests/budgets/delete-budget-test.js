import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import BudgetDetailsInteractor from '../../interactors/budgets/BudgetDetails';

describe('Budget delete', () => {
  setupApplication();

  const budgetDetails = new BudgetDetailsInteractor();

  beforeEach(async function () {
    const ledger = this.server.create('ledger');
    const fund = this.server.create('fund');
    const fiscalYear = this.server.create('fiscalYear', { id: ledger.id });
    const budget = this.server.create('budget', {
      fundId: fund.id,
      fiscalYearId: fiscalYear.id,
    });

    fund.fund.ledgerId = ledger.id;
    fund.fund.id = fund.id;

    this.visit(`/finance/budget/${budget.id}/view`);
    await budgetDetails.whenLoaded();
    await budgetDetails.actions.deleteBudgetButton.click();
  });

  it('displays remove budget confirmation modal', () => {
    expect(budgetDetails.budgetRemoveConfirmation.isPresent).to.be.true;
  });

  describe('Confirm budget removing', () => {
    beforeEach(async function () {
      await budgetDetails.budgetRemoveConfirmation.confirm();
    });

    it('Confirmation modal is closed', () => {
      expect(budgetDetails.budgetRemoveConfirmation.isPresent).to.be.false;
    });
  });
});
