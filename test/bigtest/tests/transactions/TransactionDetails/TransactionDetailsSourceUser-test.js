import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import {
  BUDGET_TRANSACTIONS_ROUTE,
  FUNDS_ROUTE,
} from '../../../../../src/common/const';
import { TRANSACTION_SOURCE } from '../../../../../src/Transactions/constants';
import setupApplication from '../../../helpers/setup-application';
import TransactionDetailsInteractor from '../../../interactors/transactions/TransactionDetailsInteractor';

describe('Transaction details - source User', () => {
  setupApplication();

  const details = new TransactionDetailsInteractor();

  beforeEach(async function () {
    const fund = this.server.create('fund');
    const budget = this.server.create('budget', {
      fundId: fund.id,
    });
    const fiscalYear = this.server.create('fiscalYear');
    const transaction = this.server.create('transaction', {
      fiscalYearId: fiscalYear.id,
      source: TRANSACTION_SOURCE.user,
    });

    this.visit(`${FUNDS_ROUTE}/view/${fund.id}/budget/${budget.id}${BUDGET_TRANSACTIONS_ROUTE}/${transaction.id}/view`);
    await details.whenLoaded();
  });

  it('should show details pane', () => {
    expect(details.isPresent).to.be.true;
  });

  it('source value is not a hotlink', () => {
    expect(details.sourceLink.isPresent).to.be.false;
  });
});
