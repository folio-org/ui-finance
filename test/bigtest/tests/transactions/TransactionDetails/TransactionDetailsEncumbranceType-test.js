import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import {
  BUDGET_ROUTE,
  BUDGET_TRANSACTIONS_ROUTE,
  TRANSACTION_TYPES,
} from '../../../../../src/common/const';
import { TRANSACTION_SOURCE } from '../../../../../src/Transactions/constants';
import setupApplication from '../../../helpers/setup-application';
import TransactionDetailsInteractor from '../../../interactors/transactions/TransactionDetailsInteractor';

describe('Transaction details', () => {
  setupApplication();

  const details = new TransactionDetailsInteractor();

  beforeEach(async function () {
    const budget = this.server.create('budget');
    const fiscalYear = this.server.create('fiscalYear');
    const poLine = this.server.create('line');
    const transaction = this.server.create('transaction', {
      fiscalYearId: fiscalYear.id,
      transactionType: TRANSACTION_TYPES.encumbrance,
      source: TRANSACTION_SOURCE.poLine,
      encumbrance: {
        status: 'Released',
        sourcePoLineId: poLine.id,
      },
    });

    this.visit(`${BUDGET_ROUTE}${budget.id}${BUDGET_TRANSACTIONS_ROUTE}${transaction.id}/view`);
    await details.whenLoaded();
  });

  it('status should be presented', () => {
    expect(details.status.isPresent).to.be.true;
    expect(details.status.value).to.contain('Released');
  });

  describe('click on source', function () {
    beforeEach(async function () {
      await details.sourceLink();
    });

    it('goes to po line details in Orders app', function () {
      expect(details.isPresent).to.be.false;
    });
  });
});
