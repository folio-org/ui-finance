import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { GROUP_EDIT_ROUTE } from '../../../../../src/common/const';

import setupApplication from '../../../helpers/setup-application';
import GroupFormInteractor from '../../../interactors/groups/GroupFormInteractor';
import GroupsListInteractor from '../../../interactors/groups/GroupsListInteractor';

const TEST_VALUE_NAME = 'test edit name';

describe('Group edit', () => {
  setupApplication();

  const groupForm = new GroupFormInteractor();

  beforeEach(async function () {
    const group = this.server.create('group', {
      name: TEST_VALUE_NAME,
    });

    this.visit(`${GROUP_EDIT_ROUTE}${group.id}`);
    await groupForm.whenLoaded();
  });

  it('should display group form with values loaded from back-end', () => {
    expect(groupForm.nameValue).to.be.equal(TEST_VALUE_NAME);
  });

  describe('Save after edit', () => {
    const groupsList = new GroupsListInteractor();

    beforeEach(async function () {
      await groupForm.name.fill('new name');

      await groupForm.saveButton.click();
      await groupsList.whenLoaded();
    });

    it('should close form', () => {
      expect(groupForm.isPresent).to.be.false;
    });
  });
});
