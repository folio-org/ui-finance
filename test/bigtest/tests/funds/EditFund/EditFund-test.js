import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import FundFormInteractor from '../../../interactors/funds/FundForm';
import FundDetailsInteractor from '../../../interactors/funds/FundDetails';

describe('Fund create', () => {
  setupApplication();

  const fundForm = new FundFormInteractor();
  const fundDetails = new FundDetailsInteractor();

  beforeEach(async function () {
    const ledger = this.server.create('ledger');
    const fund = this.server.create('fund', {
      ledgerId: ledger.id,
    });

    this.visit(`/finance/fund/view/${fund.id}`);
    await fundDetails.whenLoaded();
    await fundDetails.actions.editFund.click();
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
      await fundForm.externalAccountNo('12345');
      await fundForm.saveButton.click();
    });

    it('closes fund form', () => {
      expect(fundForm.isPresent).to.be.false;
      expect(fundDetails.isPresent).to.be.true;
    });
  });
});
