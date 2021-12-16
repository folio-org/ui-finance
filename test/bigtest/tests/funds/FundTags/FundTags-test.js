import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import FundDetailsInteractor from '../../../interactors/funds/FundDetails';
import TagsPaneInteractor from '../../../interactors/common/tags/TagsPane';

describe('Fund details tags', () => {
  this.timeout(10000);
  setupApplication();

  const fundDetails = new FundDetailsInteractor();
  const tagsPane = new TagsPaneInteractor();

  beforeEach(async function () {
    const ledger = this.server.create('ledger');
    const fund = this.server.create('fund');

    this.server.create('fiscalYear', { id: ledger.id });
    fund.fund.ledgerId = ledger.id;
    fund.fund.id = fund.id;

    this.visit(`/finance/fund/view/${fund.id}`);
    await fundDetails.whenLoaded();
  });

  it('should be displayed', () => {
    expect(fundDetails.tagsAction.isPresent).to.be.true;
  });

  it('should display tags count', () => {
    expect(fundDetails.tagsAction.count).to.equal('0');
  });

  describe('click action', () => {
    beforeEach(async function () {
      await fundDetails.tagsAction.click();
      await tagsPane.whenLoaded();
    });

    it('should open tags pane', () => {
      expect(tagsPane.isPresent).to.be.true;
    });

    describe('close tags pane', () => {
      beforeEach(async function () {
        await tagsPane.whenLoaded();
        await tagsPane.closeButton.click();
      });

      it('should close tags pane', () => {
        expect(tagsPane.isPresent).to.be.false;
      });
    });
  });

  describe('add/delete tags', () => {
    beforeEach(async function () {
      await fundDetails.tagsAction.click();
      await tagsPane.whenLoaded();
      await tagsPane.selectedTags.fillTag('tag');
      await tagsPane.addTag();
    });

    it('should add one new tag', () => {
      expect(fundDetails.tagsAction.count).to.equal('1');
    });

    describe('delete tag from the list', () => {
      beforeEach(async function () {
        await tagsPane.selectedTags.list(0).deleteTag();
      });

      it('should delete one tag', () => {
        expect(fundDetails.tagsAction.count).to.equal('0');
      });
    });
  });
});
