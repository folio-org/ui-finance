import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { GROUPS_ROUTE } from '../../../../../src/common/const';

import setupApplication from '../../../helpers/setup-application';
import GroupDetailsInteractor from '../../../interactors/groups/GroupDetailsInteractor';

describe('Group summary details', () => {
  setupApplication();

  const groupDetails = new GroupDetailsInteractor();

  beforeEach(async function () {
    const group = this.server.create('group');

    this.server.create('fiscalYear');
    this.server.createList('groupSummary', 10);

    this.visit(`${GROUPS_ROUTE}/${group.id}/view`);
    await groupDetails.whenLoaded();
  });

  it('should have 0 allocated value for defined current FY', () => {
    expect(groupDetails.groupAllocatedValue).not.to.be.equal('0');
  });
});
