import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { GROUPS_ROUTE } from '../../../../../src/common/const';

import setupApplication from '../../../helpers/setup-application';
import GroupFormInteractor from '../../../interactors/groups/GroupFormInteractor';
import GroupsListInteractor from '../../../interactors/groups/GroupsListInteractor';

describe('Group create', () => {
  setupApplication();

  const groupForm = new GroupFormInteractor();

  beforeEach(async function () {
    this.visit(`${GROUPS_ROUTE}/create`);
    await groupForm.whenLoaded();
  });

  it('should display create group form', () => {
    expect(groupForm.isPresent).to.be.true;
  });

  describe('Save not filled (missed requried) form', () => {
    beforeEach(async function () {
      await groupForm.name.fill('test name');
      await groupForm.saveButton.click();
    });

    it('should not close form', () => {
      expect(groupForm.isPresent).to.be.true;
    });
  });

  describe('Save form with all required fields', () => {
    const groupsList = new GroupsListInteractor();

    beforeEach(async function () {
      await groupForm.name.fill('Test group');
      await groupForm.code.fill('TSD');

      await groupForm.saveButton.click();
      await groupsList.whenLoaded();
    });

    it('should close form and display the list of groups', () => {
      expect(groupsList.isPresent).to.be.true;
    });
  });
});
