import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import BudgetDetailsInteractor from '../../interactors/budgets/BudgetDetails';

describe('Add transfer', () => {
  setupApplication();

  const budgetDetails = new BudgetDetailsInteractor();

  beforeEach(async function () {
    const fund = this.server.create('fund');
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
    let funds = [];

    beforeEach(async function () {
      funds = this.server.createList('fund', 2);
      await budgetDetails.addTransferButton.click();
    });

    it('add transfer modal is opened', () => {
      expect(budgetDetails.addTransferModal.isPresent).to.be.true;
    });

    describe('fill transfer to field', () => {
      beforeEach(async function () {
        await budgetDetails.addTransferModal.transferTo.select(funds[1].name);
      });

      it('transfer from field is prepopulated', () => {
        expect(budgetDetails.addTransferModal.transferFrom.value).to.be.not.equal('');
      });
    });

    describe('fill transfer from field', () => {
      beforeEach(async function () {
        await budgetDetails.addTransferModal.transferFrom.select(funds[1].name);
      });

      it('transfer to field is prepopulated', () => {
        expect(budgetDetails.addTransferModal.transferTo.value).to.be.not.equal('');
      });
    });

    describe('create new transfer', () => {
      const AMOUNT = 100;

      beforeEach(async function () {
        await budgetDetails.addTransferModal.transferTo.select(funds[1].name);
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
