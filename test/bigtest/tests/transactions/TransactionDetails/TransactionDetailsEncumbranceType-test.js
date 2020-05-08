import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import {
  TRANSACTION_TYPES,
  TRANSACTIONS_ROUTE,
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

    this.visit(`${TRANSACTIONS_ROUTE}/budget/${budget.id}/transaction/${transaction.id}/view`);
    await details.whenLoaded();
  });

  it('status should be presented', () => {
    expect(details.status.isPresent).to.be.true;
    expect(details.status.value).to.contain('Released');
  });

  describe('click on source', function () {
    beforeEach(async function () {
      await details.sourceLink.click();
    });

    it('goes to po line details in Orders app', function () {
      expect(details.isPresent).to.be.false;
    });
  });
});
