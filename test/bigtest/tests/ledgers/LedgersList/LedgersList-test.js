import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { LEDGERS_ROUTE } from '../../../../../src/common/const';

import setupApplication from '../../../helpers/setup-application';

import LedgersListInteractor from '../../../interactors/ledgers/LedgersList';

const LEDGERS_COUNT = 15;

describe('Ledgers list', () => {
  setupApplication();

  const ledgersList = new LedgersListInteractor();

  beforeEach(async function () {
    this.server.createList('ledger', LEDGERS_COUNT);

    this.visit(LEDGERS_ROUTE);
    await ledgersList.whenLoaded();
  });

  describe('search by something', function () {
    beforeEach(async function () {
      await ledgersList.fillSearchField('test');
      await ledgersList.clickSearch();
    });

    it('shows the list of ledger items', () => {
      expect(ledgersList.isPresent).to.be.true;
    });

    it('renders row for each ledger from the response', () => {
      expect(ledgersList.ledgers().length).to.be.equal(LEDGERS_COUNT);
    });
  });

  describe('Navigation', () => {
    it('should be present', () => {
      expect(ledgersList.navigation.isPresent).to.be.true;
    });

    it('should make fiscal year tab primary', () => {
      expect(ledgersList.navigation.ledgersNavBtn.isPrimary).to.be.true;
      expect(ledgersList.navigation.fiscalYearNavBtn.isPrimary).to.be.false;
      expect(ledgersList.navigation.fundsNavBtn.isPrimary).to.be.false;
    });
  });
});
