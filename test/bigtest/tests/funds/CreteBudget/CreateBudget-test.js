import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import FundDetailsInteractor from '../../../interactors/funds/FundDetails';

describe('Create budget', () => {
  setupApplication();

  const fundDetails = new FundDetailsInteractor();

  beforeEach(async function () {
    const group = this.server.create('group');
    const ledger = this.server.create('ledger');
    const fund = this.server.create('fund', {
      groupIds: [group.id],
    });

    fund.fund.ledgerId = ledger.id;

    this.visit(`/finance/fund/view/${fund.id}`);
    await fundDetails.whenLoaded();
  });

  it('shows fund details pane', () => {
    expect(fundDetails.isPresent).to.be.true;
  });

  describe('click on add new budget', () => {
    let fiscalYears = [];

    beforeEach(async function () {
      fiscalYears = this.server.createList('fiscalYear', 3);
      await fundDetails.addBudgetButton.click();
    });

    it('open add budget modal', () => {
      expect(fundDetails.addBudgetModal.isPresent).to.be.true;
    });

    describe('update budget modal form', () => {
      const TEST_ALLOWABLE_EXPENDITURE = 101;
      const TEST_ALLOWABLE_ENCUMBRANCE = 105;
      const TEST_ALLOCATED = 1000000;

      beforeEach(async function () {
        await fundDetails.addBudgetModal.fiscalYearId.select(fiscalYears[0].code);
        await fundDetails.addBudgetModal.allowableExpenditure.fill(TEST_ALLOWABLE_EXPENDITURE);
        await fundDetails.addBudgetModal.allowableEncumbrance.fill(TEST_ALLOWABLE_ENCUMBRANCE);
        await fundDetails.addBudgetModal.allocated.fill(TEST_ALLOCATED);

        await fundDetails.addBudgetModal.saveButton.click();
      });

      it('should be open budget details view', () => {
        expect(fundDetails.addBudgetModal.isPresent).to.be.false;
      });
    });

    describe('click on cancel in modal', () => {
      beforeEach(async function () {
        await fundDetails.addBudgetModal.cancelButton.click();
      });

      it('budget modal should be close', () => {
        expect(fundDetails.addBudgetModal.isPresent).to.be.false;
      });
    });
  });
});
