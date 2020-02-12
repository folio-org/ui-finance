import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import BudgetDetailsInteractor from '../../interactors/budgets/BudgetDetails';

const TEST_FUND_NAME = 'Test Fund';

describe('Add transfer', () => {
  setupApplication();

  const budgetDetails = new BudgetDetailsInteractor();

  beforeEach(async function () {
    const fund = this.server.create('fund', {
      name: TEST_FUND_NAME,
    });
    const budget = this.server.create('budget', {
      fundId: fund.id,
    });

    this.visit(`/finance/budget/${budget.id}/view`);
    await budgetDetails.whenLoaded();
  });

  it('shows transfer button', () => {
    expect(budgetDetails.isPresent).to.be.true;
  });

  describe('click on add new transfer', () => {
    beforeEach(async function () {
      await budgetDetails.actions.addTransferButton.click();
    });

    it('add transfer modal is opened', () => {
      expect(budgetDetails.addTransferModal.isPresent).to.be.true;
    });

    describe('create new transfer', () => {
      const AMOUNT = 100;

      beforeEach(async function () {
        await budgetDetails.addTransferModal.transferTo.select(TEST_FUND_NAME);
        await budgetDetails.addTransferModal.amount.fill(AMOUNT);

        await budgetDetails.addTransferModal.saveButton.click();
      });

      it('create new fransfer and modal is closed', () => {
        expect(budgetDetails.addTransferModal.isPresent).to.be.false;
      });
    });

    describe('click on cancel in modal', () => {
      beforeEach(async function () {
        await budgetDetails.addTransferModal.cancelButton.click();
      });

      it('add transfer modal is closed', () => {
        expect(budgetDetails.addTransferModal.isPresent).to.be.false;
      });
    });
  });
});
