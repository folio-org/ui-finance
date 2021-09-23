import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { GROUPS_ROUTE } from '../../../../../src/common/const';

import setupApplication from '../../../helpers/setup-application';
import GroupFormInteractor from '../../../interactors/groups/GroupFormInteractor';

const TEST_VALUE_NAME = 'test edit name';

describe('Group edit', () => {
  setupApplication();

  const groupForm = new GroupFormInteractor();

  beforeEach(async function () {
    const group = this.server.create('group', {
      name: TEST_VALUE_NAME,
    });

    this.visit(`${GROUPS_ROUTE}/${group.id}/edit`);
    await groupForm.whenLoaded();
  });

  it('should display group form with values loaded from back-end', () => {
    expect(groupForm.nameValue).to.be.equal(TEST_VALUE_NAME);
  });

  describe('Save after edit', () => {
    beforeEach(async function () {
      await groupForm.name.fill('new name');

      await groupForm.saveButton.click();
    });

    it('should close form', () => {
      expect(groupForm.isPresent).to.be.false;
    });
  });
});
