import {
  budgetsData,
  expenseClassesData,
  exportReport,
  fundsData,
} from '../../../../../test/jest/fixtures/export';

import { createExportReport } from './createExportReport';

const intl = {
  formatMessage: jest.fn((value) => value),
  formatDate: jest.fn((value) => value),
};

describe('createExportReport', () => {
  it('should create export report', async () => {
    const report = await createExportReport({
      budgetsData,
      expenseClassesData,
      fundsData,
    }, { intl });

    expect(report).toEqual(exportReport);
  });
});
