import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';

import FiscalYearListInteractor from '../../../interactors/fiscalYear/FiscalYearList';

const YEARS_COUNT = 15;

describe('Fiscal year list', () => {
  setupApplication();

  const fiscalYearList = new FiscalYearListInteractor();

  beforeEach(async function () {
    this.server.createList('fiscalYear', YEARS_COUNT);

    this.visit('/finance/fiscalyear');
    await fiscalYearList.whenLoaded();
  });

  it('shows the list of year items', () => {
    expect(fiscalYearList.isPresent).to.be.true;
  });

  it('renders row for each year from the response', () => {
    expect(fiscalYearList.fiscalYears().length).to.be.equal(YEARS_COUNT);
  });

  describe('Navigation', () => {
    it('should be present', () => {
      expect(fiscalYearList.navigation.isPresent).to.be.true;
    });

    it('should make fiscal year tab primary', () => {
      expect(fiscalYearList.navigation.fiscalYearNavBtn.isPrimary).to.be.true;
      expect(fiscalYearList.navigation.fundsNavBtn.isPrimary).to.be.false;
      expect(fiscalYearList.navigation.ledgersNavBtn.isPrimary).to.be.false;
    });
  });
});
