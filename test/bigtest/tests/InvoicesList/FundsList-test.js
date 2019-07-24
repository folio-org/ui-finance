import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import FundsListInteractor from '../../interactors/FundsList';

const FUNDS_COUNT = 15;

describe.only('Funds list', () => {
  setupApplication();

  const fundsList = new FundsListInteractor();

  beforeEach(async function () {
    this.server.createList('fund', FUNDS_COUNT);

    this.visit('/finance/fund');
    await fundsList.whenLoaded();
  });

  it('shows the list of fund items', () => {
    expect(fundsList.isPresent).to.equal(true);
  });

  it('renders row for each fund from the response', () => {
    expect(fundsList.funds().length).to.be.equal(FUNDS_COUNT);
  });
});
