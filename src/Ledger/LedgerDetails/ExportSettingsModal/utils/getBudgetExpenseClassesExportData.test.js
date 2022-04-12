import { EXPENSE_CLASSES_API } from '@folio/stripes-acq-components';

import {
  budgetsData,
  expenseClassesData,
} from '../../../../../test/jest/fixtures/export';
import { BUDGETS_API } from '../../../../common/const';
import { EXPORT_EXPENSE_CLASSES_VALUES } from '../constants';
import { getBudgetExpenseClassesExportData } from './getBudgetExpenseClassesExportData';

const budgetData = Object.values(budgetsData)[0];
const expenseClassData = Object.values(expenseClassesData)[0];

const ky = {
  get: (url) => ({
    json: jest.fn(() => Promise.resolve(
      ({
        [`${BUDGETS_API}/${budgetData.id}/expense-classes-totals`]: {
          budgetExpenseClassTotals: expenseClassData,
        },
        [EXPENSE_CLASSES_API]: {
          expenseClasses: [expenseClassData],
        },
      })[url],
    )),
  }),
};

describe('getBudgetExpenseClassesExportData', () => {
  it('should return allocatable funds export data', async () => {
    const exportData = await getBudgetExpenseClassesExportData(ky)({
      budgetsData,
      expenseClasses: EXPORT_EXPENSE_CLASSES_VALUES.all,
    });

    expect(exportData).toEqual(expenseClassesData);
  });

  it('should return empty array if expense classes config equals \'none\'', async () => {
    const exportData = await getBudgetExpenseClassesExportData(ky)({
      budgetsData,
      expenseClasses: EXPORT_EXPENSE_CLASSES_VALUES.none,
    });

    expect(exportData).toEqual([]);
  });
});
