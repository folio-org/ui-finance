import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { GROUPS_ROUTE } from '../../../../../src/common/const';

import setupApplication from '../../../helpers/setup-application';
import GroupsListInteractor from '../../../interactors/groups/GroupsListInteractor';

const GROUPS_COUNT = 15;

describe('Groups list', () => {
  setupApplication();

  const groupsList = new GroupsListInteractor();

  beforeEach(async function () {
    this.server.createList('group', GROUPS_COUNT);

    this.visit(GROUPS_ROUTE);
    await groupsList.whenLoaded();
  });

  it('shows the list of year items', () => {
    expect(groupsList.isPresent).to.be.true;
  });

  it('renders row for each year from the response', () => {
    expect(groupsList.groups().length).to.be.equal(GROUPS_COUNT);
  });

  describe('Navigation', () => {
    it('should be present', () => {
      expect(groupsList.navigation.isPresent).to.be.true;
    });

    it('should make group tab primary', () => {
      expect(groupsList.navigation.groupNavBtn.isPrimary).to.be.true;
      expect(groupsList.navigation.fiscalYearNavBtn.isPrimary).to.be.false;
      expect(groupsList.navigation.fundsNavBtn.isPrimary).to.be.false;
      expect(groupsList.navigation.ledgersNavBtn.isPrimary).to.be.false;
    });
  });
});
