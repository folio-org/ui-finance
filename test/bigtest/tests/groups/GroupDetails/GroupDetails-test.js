import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { GROUPS_ROUTE } from '../../../../../src/common/const';

import setupApplication from '../../../helpers/setup-application';
import GroupDetailsInteractor from '../../../interactors/groups/GroupDetailsInteractor';

describe('Group details', () => {
  setupApplication();

  const groupDetails = new GroupDetailsInteractor();
  let fundA = null;
  let fundZ = null;

  beforeEach(async function () {
    const group = this.server.create('group');
    const fiscalYear = this.server.create('fiscalYear');

    fundA = this.server.create('fund', { code: 'funda', name: 'fund a' });
    fundZ = this.server.create('fund', { code: 'fundz', name: 'fund z' });

    this.server.create('budget', {
      name: 'budget a',
      fundId: fundA.id,
      fiscalYearId: fiscalYear.id,
    });
    this.server.create('budget', {
      name: 'budget z',
      fundId: fundZ.id,
      fiscalYearId: fiscalYear.id,
    });
    this.server.createList('groupExpenseClassTotal', 2);

    this.visit(`${GROUPS_ROUTE}/${group.id}/view`);
    await groupDetails.whenLoaded();
  });

  it('should show details pane', () => {
    expect(groupDetails.isPresent).to.be.true;
  });

  describe('sort by expended in expense classes', () => {
    beforeEach(async function () {
      await groupDetails.whenExpenseClassesLoaded();
      await groupDetails.expenseClasses.sortByExpended();
    });

    it('shows expense classes', () => {
      expect(groupDetails.expenseClasses.listIsPresent).to.be.true;
    });
  });

  describe('close action', () => {
    beforeEach(async function () {
      await groupDetails.closePane.click();
    });

    it('should close details pane', () => {
      expect(groupDetails.isPresent).to.be.false;
    });
  });
});
