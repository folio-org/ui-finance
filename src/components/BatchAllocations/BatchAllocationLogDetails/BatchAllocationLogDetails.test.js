import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { BatchAllocationLogDetails } from './BatchAllocationLogDetails';

const batchAllocationLog = {
  financeData: [
    {
      fundId: '87aee45d-e53f-45ca-a020-be6b176108e4',
      budgetId: 'df9dcbd5-76c7-40ab-ba02-e08a89eea4ef',
      fundCode: 'WBF',
      fundName: 'Without budget',
      fundTags: {
        tagList: [],
      },
      ledgerId: '506d4ef1-73e9-4519-97a4-208d10418fc7',
      budgetName: 'WBF-TY2026',
      fundStatus: 'Active',
      ledgerCode: 'TSTLDGR',
      budgetStatus: 'Active',
      fiscalYearId: '97bd7ecc-7d8d-42b7-a450-96c7e7a85d2b',
      isFundChanged: true,
      fiscalYearCode: 'TY2026',
      fundAcqUnitIds: [],
      transactionTag: {
        tagList: ['important'],
      },
      isBudgetChanged: true,
      budgetAcqUnitIds: [],
      budgetAfterAllocation: 45,
      budgetAllocationChange: 3,
      budgetCurrentAllocation: 42,
      transactionDescription: 'Test',
      budgetAllowableEncumbrance: 10,
      budgetAllowableExpenditure: 20,
    },
  ],
  jobNumber: 1,
  jobName: 'Job Name 1',
  status: 'COMPLETED',
  recordsCount: 1,
  metadata: {
    createdDate: '2025-02-10T01:54:30.162+00:00',
    updatedDate: '2025-02-10T01:54:30.162+00:00',
  },
};

const defaultProps = {
  batchAllocationLog,
  onClose: jest.fn(),
  onRemove: jest.fn(),
};

const renderComponent = (props = {}) => render(
  <BatchAllocationLogDetails
    {...defaultProps}
    {...props}
  />,
);

describe('BatchAllocationLogDetails', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render finance data values', () => {
    renderComponent();

    const logFinanceData = batchAllocationLog.financeData[0];

    // Columns values of the logs list
    [
      logFinanceData.fundName,
      'ui-finance.fund.status.active',
      logFinanceData.budgetName,
      logFinanceData.budgetCurrentAllocation,
      'ui-finance.budget.status.active',
      logFinanceData.budgetAllocationChange,
      logFinanceData.budgetAfterAllocation,
      logFinanceData.budgetAllowableEncumbrance,
      logFinanceData.budgetAllowableExpenditure,
      logFinanceData.transactionDescription,
      logFinanceData.transactionTag.tagList?.join(', '),
    ].forEach((value) => {
      expect(screen.getByText(value)).toBeInTheDocument();
    });
  });

  it('should render "No value" when budget status is not provided', () => {
    renderComponent({
      batchAllocationLog: {
        ...batchAllocationLog,
        financeData: [{
          ...batchAllocationLog.financeData[0],
          budgetStatus: undefined,
        }],
      },
    });

    expect(screen.getByText('stripes-components.noValue.noValueSet')).toBeInTheDocument();
  });
});
