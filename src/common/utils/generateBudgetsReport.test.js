import {
  budgetsData,
  expenseClassesData,
  fundsData,
} from '../../../test/jest/fixtures/export';

import { generateBudgetsReport } from './generateBudgetsReport';

jest.mock('../../Ledger/LedgerDetails/ExportSettingsModal/utils', () => ({
  ...jest.requireActual('../../Ledger/LedgerDetails/ExportSettingsModal/utils'),
  getAcqUnitsData: jest.fn(() => () => ({})),
  getFundGroupsData: jest.fn(() => () => ({
    '69640328-788e-43fc-9c3c-af39e243f3b7': [{ code: 'ANZHIST' }],
  })),
}));

const data = [
  {
    ...Object.values(budgetsData)[0],
    fundDetails: {
      ...Object.values(fundsData)[0],
      allocatedFromNames: [],
      allocatedToNames: [],
    },
    expenseClassDetails: [{
      ...Object.values(expenseClassesData)[0],
      expenseClassName: 'Electronic',
    }],
  },
];

const kyMock = {
  get: jest.fn(() => ({
    json: () => Promise.resolve({}),
  })),
};

describe('generateBudgetsReport', () => {
  it('should create budgets export report', async () => {
    const report = await generateBudgetsReport(kyMock)(data);

    expect(report[0]).toEqual(expect.objectContaining({
      fundName: data[0].fundDetails.name,
      budgetName: data[0].name,
      expenseClassName: data[0].expenseClassDetails[0].expenseClassName,
    }));
  });
});
