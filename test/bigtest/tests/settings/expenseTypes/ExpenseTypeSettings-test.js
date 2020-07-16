import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import ExpenseTypeSettingsInteractor from '../../../interactors/settings/ExpenseTypeSettingsInteractor';

const EXPENSE_TYPES_COUNT = 10;

describe('Setting - Expense types', function () {
  setupApplication();

  const expenseTypeSettings = new ExpenseTypeSettingsInteractor();

  beforeEach(async function () {
    this.server.createList('expenseClass', EXPENSE_TYPES_COUNT);

    this.visit('/settings/finance/expense-types');
    await expenseTypeSettings.whenLoaded();
  });

  it('should be rendered', () => {
    expect(expenseTypeSettings.isPresent).to.be.true;
    expect(expenseTypeSettings.addExpenseTypeBtn.isPresent).to.be.true;
  });

  it('should display all expense types', () => {
    expect(expenseTypeSettings.expenseTypes().length).to.be.equal(EXPENSE_TYPES_COUNT);
  });
});
