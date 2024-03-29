import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';

import FundsListInteractor from '../../../interactors/funds/FundsList';
import LedgersListInteractor from '../../../interactors/ledgers/LedgersList';
import FiscalYearListInteractor from '../../../interactors/fiscalYear/FiscalYearList';
import { FUNDS_ROUTE } from '../../../../../src/common/const';

const FUNDS_COUNT = 15;

describe('Funds list', () => {
  setupApplication();

  const fundsList = new FundsListInteractor();

  beforeEach(async function () {
    this.server.createList('fund', FUNDS_COUNT);

    this.visit(`${FUNDS_ROUTE}?fundStatus=Active&limit=100&offset=0`);
    await fundsList.whenLoaded();
  });

  it('shows the list of fund items', () => {
    expect(fundsList.isPresent).to.be.true;
  });

  it('renders row for each fund from the response', () => {
    expect(fundsList.funds().length).to.be.equal(FUNDS_COUNT);
  });

  describe('Navigation', () => {
    it('should be present', () => {
      expect(fundsList.navigation.isPresent).to.be.true;
    });

    it('should make funds tab primary', () => {
      expect(fundsList.navigation.fundsNavBtn.isPrimary).to.be.true;
      expect(fundsList.navigation.ledgersNavBtn.isPrimary).to.be.false;
      expect(fundsList.navigation.fiscalYearNavBtn.isPrimary).to.be.false;
    });

    describe('to Ledgers', () => {
      const ledgersList = new LedgersListInteractor();

      beforeEach(async function () {
        await fundsList.navigation.ledgersNavBtn.click();
      });

      it('should open the ledgers list', () => {
        expect(ledgersList.newButton.isPresent).to.be.true;
      });
    });

    describe('to Fiscal year', () => {
      const fiscalYearList = new FiscalYearListInteractor();

      beforeEach(async function () {
        await fundsList.navigation.fiscalYearNavBtn.click();
      });

      it('should open the fiscal years list', () => {
        expect(fiscalYearList.newButton.isPresent).to.be.true;
      });
    });
  });
});
