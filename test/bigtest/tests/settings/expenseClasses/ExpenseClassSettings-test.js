import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import ExpenseClassSettingsInteractor from '../../../interactors/settings/ExpenseClassSettingsInteractor';

const EXPENSE_CLASSES_COUNT = 10;

describe('Setting - Expense classes', function () {
  setupApplication();

  const expenseClassSettings = new ExpenseClassSettingsInteractor();

  beforeEach(async function () {
    this.server.createList('expenseClass', EXPENSE_CLASSES_COUNT);

    this.visit('/settings/finance/expense-classes');
    await expenseClassSettings.whenLoaded();
  });

  it('should be rendered', () => {
    expect(expenseClassSettings.isPresent).to.be.true;
    expect(expenseClassSettings.addExpenseClassBtn.isPresent).to.be.true;
  });

  it('should display all expense classes', () => {
    expect(expenseClassSettings.expenseClasses().length).to.be.equal(EXPENSE_CLASSES_COUNT);
  });
});
