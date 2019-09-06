import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { GROUP_VIEW_ROUTE } from '../../../../../src/common/const';

import setupApplication from '../../../helpers/setup-application';
import GroupDetailsInteractor from '../../../interactors/groups/GroupDetailsInteractor';

describe('Group details', () => {
  setupApplication();

  const groupDetails = new GroupDetailsInteractor();

  beforeEach(async function () {
    const group = this.server.create('group');

    this.visit(`${GROUP_VIEW_ROUTE}${group.id}`);
    await groupDetails.whenLoaded();
  });

  it('should show details pane', () => {
    expect(groupDetails.isPresent).to.be.true;
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
