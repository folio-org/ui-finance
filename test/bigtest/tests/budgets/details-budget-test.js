import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import BudgetDetailsInteractor from '../../interactors/budgets/BudgetDetails';
import FundDetailsInteractor from '../../interactors/funds/FundDetails';
import BudgetEdit from '../../interactors/budgets/BudgetEdit';

describe('Budget details', () => {
  setupApplication();

  const budgetDetails = new BudgetDetailsInteractor();
  const fundDetails = new FundDetailsInteractor();
  const budgetForm = new BudgetEdit();

  beforeEach(async function () {
    const ledger = this.server.create('ledger');
    const fund = this.server.create('fund');
    const fiscalYear = this.server.create('fiscalYear', { id: ledger.id });
    const expenseClass = this.server.create('expenseClass');

    fund.fund.ledgerId = ledger.id;
    fund.fund.id = fund.id;

    const budget = this.server.create('budget', {
      fiscalYearId: fiscalYear.id,
      fundId: fund.fund.id,
    });

    this.server.create('budgetExpenseClassTotal', { id: expenseClass.id, expenseClassName: expenseClass.name });

    this.visit(`finance/budget/${budget.id}/view`);
    await budgetDetails.whenLoaded();
  });

  it('shows budget details', () => {
    expect(budgetDetails.isPresent).to.be.true;
    expect(budgetDetails.expenseClassesAccordion).to.be.true;
  });

  describe('close budget details', () => {
    beforeEach(async function () {
      await budgetDetails.closePane.click();
      await fundDetails.whenLoaded();
    });

    it('closes budget details', () => {
      expect(budgetDetails.isPresent).to.be.false;
      expect(fundDetails.isPresent).to.be.true;
    });
  });

  describe('edit budget', () => {
    beforeEach(async function () {
      await budgetDetails.actions.editBudgetButton.click();
      await budgetForm.whenLoaded();
    });

    it('shows budget form', () => {
      expect(budgetForm.isPresent).to.be.true;
    });
  });
});
