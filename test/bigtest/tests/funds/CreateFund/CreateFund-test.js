import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import FundFormInteractor from '../../../interactors/funds/FundForm';
import FundsListInteractor from '../../../interactors/funds/FundsList';
import { FUNDS_ROUTE } from '../../../../../src/common/const';

describe('Fund create', () => {
  setupApplication();

  const fundForm = new FundFormInteractor();
  const fundsList = new FundsListInteractor();

  beforeEach(async function () {
    this.server.createList('fund', 2);
    this.visit(FUNDS_ROUTE);
    await fundsList.whenLoaded();
    await fundsList.newButton.click();
  });

  it('displays an create fund form', () => {
    expect(fundForm.isPresent).to.be.true;
  });

  describe('close fund form', () => {
    beforeEach(async function () {
      await fundForm.closePane.click();
    });

    it('closes fund form', () => {
      expect(fundForm.isPresent).to.be.false;
      expect(fundsList.isPresent).to.be.true;
    });
  });
});
