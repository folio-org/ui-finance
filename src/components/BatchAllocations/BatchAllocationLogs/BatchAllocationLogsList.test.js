import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { BatchAllocationLogsList } from './BatchAllocationLogsList';

const wrapper = ({ children }) => (
  <MemoryRouter initialEntries={['/finance/ledger/batch-allocations/logs']}>
    {children}
  </MemoryRouter>
);

const defaultProps = {
  allRecordsSelected: false,
  height: 100,
  isLoading: false,
  logs: [{
    jobNumber: 1,
    jobName: 'Job Name 1',
    jobDetails: {},
    status: 'IN_PROGRESS',
    recordsCount: 1,
    metadata: {
      createdDate: '2025-02-10T01:54:30.162+00:00',
      updatedDate: '2025-02-10T01:54:30.162+00:00',
    },
    createdByUser: { personal: {
      firstName: 'firstName',
      lastName: 'lastName',
    } },
  },
  {
    jobNumber: 2,
    jobName: 'Job Name 2',
    jobDetails: {},
    status: 'IN_PROGRESS',
    recordsCount: 2,
    metadata: {
      createdDate: '2025-02-10T01:54:30.162+00:00',
      updatedDate: '2025-02-10T01:54:30.162+00:00',
    },
    createdByUser: { personal: {
      firstName: 'firstName',
      lastName: 'lastName',
    } },
  }],
  selectedRecordsMap: jest.fn(),
  selectRecord: jest.fn(),
  totalRecords: 10,
  toggleSelectAll: jest.fn(),
  isEmptyMessage: jest.fn(),
  width: 100,
};

const renderComponent = (props = {}) => render(
  <BatchAllocationLogsList
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('BatchAllocationLogsList', () => {
  it('renders select all checkbox', () => {
    renderComponent();

    const checkboxes = screen.getByRole('checkbox', { name: 'ui-finance.allocation.batch.logs.columns.selectAll' });

    expect(checkboxes).toBeInTheDocument();
  });

  it('renders columns', () => {
    renderComponent();

    expect(screen.getByText('ui-finance.allocation.batch.logs.columns.jobName')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.allocation.batch.logs.columns.status')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.allocation.batch.logs.columns.recordsCount')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.allocation.batch.logs.columns.createdDate')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.allocation.batch.logs.columns.updatedDate')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.allocation.batch.logs.columns.createdByUsername')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.allocation.batch.logs.columns.jobNumber')).toBeInTheDocument();
  });
});
