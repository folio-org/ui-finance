import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import FundDetailsInteractor from '../../../interactors/funds/FundDetails';

describe('Fund delete', () => {
  setupApplication();

  const fundDetails = new FundDetailsInteractor();

  beforeEach(async function () {
    const ledger = this.server.create('ledger');
    const fund = this.server.create('fund');

    this.server.create('fiscalYear', { id: ledger.id });

    fund.fund.ledgerId = ledger.id;
    fund.fund.id = fund.id;

    this.visit(`/finance/fund/view/${fund.id}`);
    await fundDetails.whenLoaded();
    await fundDetails.actions.deleteFund.click();
  });

  it('displays remove fund confirmation modal', () => {
    expect(fundDetails.fundRemoveConfirmationModal.isPresent).to.be.true;
  });
});
