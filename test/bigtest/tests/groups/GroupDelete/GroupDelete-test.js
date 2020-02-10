import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { GROUPS_ROUTE } from '../../../../../src/common/const';

import setupApplication from '../../../helpers/setup-application';
import GroupDetailsInteractor from '../../../interactors/groups/GroupDetailsInteractor';

describe('Group delete', () => {
  setupApplication();

  const groupDetails = new GroupDetailsInteractor();

  beforeEach(async function () {
    const group = this.server.create('group');

    this.visit(`${GROUPS_ROUTE}/${group.id}/view`);
    await groupDetails.whenLoaded();
    await groupDetails.actions.deleteGroup.click();
  });

  it('displays remove group confirmation modal', () => {
    expect(groupDetails.groupRemoveConfirmationModal.isPresent).to.be.true;
  });

  describe('Confirm group removing', () => {
    beforeEach(async function () {
      await groupDetails.groupRemoveConfirmationModal.removeButton.click();
    });

    it('displays group list', () => {
      expect(groupDetails.isPresent).to.be.false;
    });
  });
});
