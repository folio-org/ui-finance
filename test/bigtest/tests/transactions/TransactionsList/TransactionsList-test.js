import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import {
  BUDGET_ROUTE,
  BUDGET_TRANSACTIONS_ROUTE,
} from '../../../../../src/common/const';

import setupApplication from '../../../helpers/setup-application';
import TransactionsListInteractor from '../../../interactors/transactions/TransactionsListInteractor';
import TransactionDetailsInteractor from '../../../interactors/transactions/TransactionDetailsInteractor';

const TRANSACTIONS_COUNT = 15;

describe('Transactions list', () => {
  setupApplication();

  const transactionsList = new TransactionsListInteractor();

  beforeEach(async function () {
    const fiscalYear = this.server.create('fiscalYear');
    const fund = this.server.create('fund');
    const budget = this.server.create('budget', { fundId: fund.id });

    this.server.create('transaction', {
      amount: -1,
      fiscalYearId: fiscalYear.id,
      toFundId: fund.id,
    });

    this.server.createList('transaction', TRANSACTIONS_COUNT - 1, {
      fiscalYearId: fiscalYear.id,
    });

    this.visit(`${BUDGET_ROUTE}${budget.id}${BUDGET_TRANSACTIONS_ROUTE}`);
    await transactionsList.whenLoaded();
  });

  it('should render row for each transaction from the response', () => {
    expect(transactionsList.isPresent).to.be.true;
    expect(transactionsList.transactions().length).to.be.equal(TRANSACTIONS_COUNT);
    expect(transactionsList.transactions(0).rowText).to.contain('($1.00)');
  });

  describe('select item', function () {
    const transactionDetails = new TransactionDetailsInteractor();

    beforeEach(async function () {
      await transactionsList.transactions(0).click();
      await transactionDetails.whenLoaded();
    });

    it('should open transaction details', function () {
      expect(transactionDetails.isPresent).to.be.true;
    });
  });
});
