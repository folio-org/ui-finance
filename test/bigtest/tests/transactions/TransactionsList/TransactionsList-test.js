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
    const budget = this.server.create('budget');
    this.server.createList('transaction', TRANSACTIONS_COUNT, {
      fiscalYearId: fiscalYear.id,
    });

    this.visit(`${BUDGET_ROUTE}${budget.id}${BUDGET_TRANSACTIONS_ROUTE}`);
    await transactionsList.whenLoaded();
  });

  it('should display the list of transaction items', () => {
    expect(transactionsList.isPresent).to.be.true;
  });

  it('should render row for each transaction from the response', () => {
    expect(transactionsList.transactions().length).to.be.equal(TRANSACTIONS_COUNT);
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
