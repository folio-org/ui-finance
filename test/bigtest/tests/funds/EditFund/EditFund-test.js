import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import FundFormInteractor from '../../../interactors/funds/FundForm';
import FundDetailsInteractor from '../../../interactors/funds/FundDetails';

describe('Fund edit', () => {
  setupApplication();

  const fundForm = new FundFormInteractor();
  const fundDetails = new FundDetailsInteractor();

  beforeEach(async function () {
    const group = this.server.create('group');
    const ledger = this.server.create('ledger');
    const fiscalYear = this.server.create('fiscalYear', { id: ledger.id });
    const fund = this.server.create('fund', {
      groupIds: [group.id],
    });

    fund.fund.ledgerId = ledger.id;

    this.server.create('budget', {
      fundId: fund.id,
      fiscalYearId: fiscalYear.id,
    });

    this.visit(`/finance/fund/view/${fund.id}`);
    await fundDetails.whenLoaded();
    await fundDetails.actions.editFund.click();
    await fundForm.whenLoaded();
  });

  it('displays an edit fund form', () => {
    expect(fundForm.isPresent).to.be.true;
  });

  describe('close fund form', () => {
    beforeEach(async function () {
      await fundForm.closePane.click();
    });

    it('closes fund form', () => {
      expect(fundForm.isPresent).to.be.false;
      expect(fundDetails.isPresent).to.be.true;
    });
  });

  describe('save and close fund form', () => {
    beforeEach(async function () {
      await fundForm.externalAccountNo.fillAndBlur('12345');
      await fundForm.saveButton.click();
    });

    it('fund form is still presented, since validation errors', () => {
      expect(fundForm.isPresent).to.be.true;
      expect(fundDetails.isPresent).to.be.false;
    });
  });
});
