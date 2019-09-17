import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import {
  BUDGET_ROUTE,
  BUDGET_TRANSACTIONS_ROUTE,
} from '../../../../../src/common/const';
import setupApplication from '../../../helpers/setup-application';
import TransactionDetailsInteractor from '../../../interactors/transactions/TransactionDetailsInteractor';

describe('Transaction details', () => {
  setupApplication();

  const details = new TransactionDetailsInteractor();

  beforeEach(async function () {
    const budget = this.server.create('budget');
    const fiscalYear = this.server.create('fiscalYear');
    const transaction = this.server.create('transaction', {
      fiscalYearId: fiscalYear.id,
    });

    this.visit(`${BUDGET_ROUTE}${budget.id}${BUDGET_TRANSACTIONS_ROUTE}${transaction.id}/view`);
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
