import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import BudgetEditInteractor from '../../interactors/budgets/BudgetEdit';
import BudgetEdetailsInteractor from '../../interactors/budgets/BudgetDetails';

const TEST_NAME = 'test budget name';

describe('Budget edit', () => {
  setupApplication();

  const budgetEdit = new BudgetEditInteractor();
  const budgetDetails = new BudgetEdetailsInteractor();

  beforeEach(async function () {
    const fund = this.server.create('fund');
    const fiscalYear = this.server.create('fiscalYear');
    const budget = this.server.create('budget', {
      fundId: fund.id,
      fiscalYearId: fiscalYear.id,
    });

    this.server.createList('expenseClass', 2);

    this.visit(`finance/budget/${budget.id}/edit`);
    await budgetEdit.whenLoaded();
  });

  it('shows budget edit form', () => {
    expect(budgetEdit.isPresent).to.be.true;
  });

  it('should be have disabled field', () => {
    expect(budgetEdit.expended.isDisabled).to.be.true;
    expect(budgetEdit.awaitingPayment.isDisabled).to.be.true;
    expect(budgetEdit.encumbered.isDisabled).to.be.true;
  });

  describe('change name', function () {
    beforeEach(async function () {
      await budgetEdit.name.fill(TEST_NAME);
    });

    it('name should be changed', () => {
      expect(budgetEdit.name.value).to.be.equal(TEST_NAME);
    });
  });

  describe('expense classes could be added', function () {
    beforeEach(async function () {
      await budgetEdit.budgetExpenseClassesAccordion.addExpenseClassButton.click();
    });

    it('expense class fields are added', function () {
      expect(budgetEdit.budgetExpenseClassesAccordion.expenseClasses().length).to.be.equal(1);
    });
  });

  describe('save changes', function () {
    beforeEach(async function () {
      await budgetEdit.name.fill(TEST_NAME);
      await budgetEdit.updateBudget.click();
    });

    it('shoul be return to budget details', () => {
      expect(budgetDetails.isPresent).to.be.true;
    });
  });
});
