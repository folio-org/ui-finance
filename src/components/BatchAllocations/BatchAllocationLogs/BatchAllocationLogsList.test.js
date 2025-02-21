import { MemoryRouter } from 'react-router-dom';

import user from '@folio/jest-config-stripes/testing-library/user-event';
import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import { useFiltersToogle } from '@folio/stripes-acq-components';

import { BatchAllocationLogsList } from './BatchAllocationLogsList';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useFiltersToogle: jest.fn(),
}));

const wrapper = ({ children }) => (
  <MemoryRouter initialEntries={['/finance/ledger/batch-allocations/logs']}>
    {children}
  </MemoryRouter>
);

const defaultProps = {
  dataReset: jest.fn(),
  deleteLog: jest.fn(),
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
  onClose: jest.fn(),
  totalRecords: 0,
};

const renderComponent = (props = {}) => render(
  <BatchAllocationLogsList
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('BatchAllocationLogsList', () => {
  beforeEach(() => {
    useFiltersToogle.mockReturnValue({ isFiltersOpened: false, toggleDeleteModal: () => {} });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders BatchAllocationLogsList', () => {
    renderComponent();

    expect(screen.getByText('ui-finance.allocation.batch.logs.title')).toBeInTheDocument();
  });

  it('deletes button should be disabled', async () => {
    renderComponent();

    expect(screen.getByTestId('delete-log-button')).toBeDisabled();
  });

  it('deletes button should be enabled after checkbox click', async () => {
    renderComponent();

    const checkboxes = screen.getAllByRole('checkbox', { name: 'ui-finance.allocation.batch.logs.columns.select' });

    await user.click(checkboxes[0]);

    expect(screen.getByTestId('delete-log-button')).toBeEnabled();
  });

  it('displays modal on delete attempt', async () => {
    renderComponent();

    const checkboxes = screen.getAllByRole('checkbox', { name: 'ui-finance.allocation.batch.logs.columns.select' });

    await user.click(checkboxes[0]);
    await user.click(screen.getByTestId('delete-log-button'));

    expect(screen.getByText('ui-finance.allocation.batch.logs.modal.delete.title')).toBeInTheDocument();
  });

  it('deletes selected log', async () => {
    renderComponent();

    const checkboxes = screen.getAllByRole('checkbox', { name: 'ui-finance.allocation.batch.logs.columns.select' });

    await user.click(checkboxes[0]);
    await user.click(screen.getByTestId('delete-log-button'));
    await user.click(screen.getByText('ui-finance.transaction.button.confirm'));

    expect(defaultProps.deleteLog).toHaveBeenCalled();
  });
});
