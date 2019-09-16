import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { TRANSACTION_VIEW_ROUTE } from '../../../../../src/common/const';
import setupApplication from '../../../helpers/setup-application';
import TransactionDetailsInteractor from '../../../interactors/transactions/TransactionDetailsInteractor';

describe('Transaction details', () => {
  setupApplication();

  const details = new TransactionDetailsInteractor();

  beforeEach(async function () {
    const fiscalYear = this.server.create('fiscalYear');
    const transaction = this.server.create('transaction', {
      fiscalYearId: fiscalYear.id,
    });
    this.visit(`${TRANSACTION_VIEW_ROUTE}${transaction.id}`);
    await details.whenLoaded();
  });

  it('should show details pane', () => {
    expect(details.isPresent).to.be.true;
  });

  describe('close action', () => {
    beforeEach(async function () {
      await details.closePane.click();
    });

    it('should close details pane', () => {
      expect(details.isPresent).to.be.false;
    });
  });
});
