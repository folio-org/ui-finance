import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import {
  BUDGET_ROUTE,
  BUDGET_TRANSACTIONS_ROUTE,
} from '../../../../../src/common/const';
import { TRANSACTION_SOURCE } from '../../../../../src/Transactions/constants';
import setupApplication from '../../../helpers/setup-application';
import TransactionDetailsInteractor from '../../../interactors/transactions/TransactionDetailsInteractor';
import FiscalYearDetailsInteractor from '../../../interactors/fiscalYear/FiscalYearDetails';

describe('Transaction details', () => {
  setupApplication();

  const details = new TransactionDetailsInteractor();
  const fiscalYearDetails = new FiscalYearDetailsInteractor();

  beforeEach(async function () {
    const budget = this.server.create('budget');
    const fiscalYear = this.server.create('fiscalYear');
    const transaction = this.server.create('transaction', {
      fiscalYearId: fiscalYear.id,
      source: TRANSACTION_SOURCE.fiscalYear,
    });

    this.visit(`${BUDGET_ROUTE}${budget.id}${BUDGET_TRANSACTIONS_ROUTE}${transaction.id}/view`);
    await details.whenLoaded();
  });

  it('should show details pane', () => {
    expect(details.isPresent).to.be.true;
  });

  it('encumbrance values for non-encumbrance transactions should not be presented', () => {
    expect(details.status.isPresent).to.be.false;
  });

  describe('click on source', function () {
    beforeEach(async function () {
      await details.sourceLink();
    });

    it('goes to fiscal year in finance app', function () {
      expect(details.isPresent).to.be.false;
      expect(fiscalYearDetails.isPresent).to.be.true;
    });
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
