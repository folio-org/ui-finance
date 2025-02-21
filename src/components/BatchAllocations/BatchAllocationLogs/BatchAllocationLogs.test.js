import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import user from '@folio/jest-config-stripes/testing-library/user-event';
import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import {
  useFiltersToogle,
  useUsersBatch,
} from '@folio/stripes-acq-components';

import {
  useBatchAllocationLogs,
  useBatchAllocationLogsMutation,
} from '../hooks';
import { BatchAllocationLogs } from './BatchAllocationLogs';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useFiltersToogle: jest.fn(),
  useUsersBatch: jest.fn(),
}));
jest.mock('../hooks', () => ({
  useBatchAllocationLogs: jest.fn(),
  useBatchAllocationLogsMutation: jest.fn(),
}));

const deleteLog = jest.fn();

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <MemoryRouter initialEntries={['/finance/ledger/batch-allocations/logs']}>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </MemoryRouter>
);

const defaultProps = {
  history: { push: jest.fn() },
  location: { hash: 'hash', pathname: 'pathname' },
  match: { params: { id: '1' } },
};

const renderComponent = (props = {}) => render(
  <BatchAllocationLogs
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('BatchAllocationLogs', () => {
  beforeEach(() => {
    useBatchAllocationLogs.mockReturnValue({
      data: [{
        jobNumber: 1,
        jobName: 'Job Name 1',
        status: 'IN_PROGRESS',
        recordsCount: 1,
        metadata: {
          createdDate: '2025-02-10T01:54:30.162+00:00',
          updatedDate: '2025-02-10T01:54:30.162+00:00',
        },
      }],
      totalRecords: 1,
      isFetching: false,
      refetch: () => {},
    });
    useBatchAllocationLogsMutation.mockReturnValue({ deleteLog });

    useUsersBatch.mockReturnValue({ users: [], isLoading: false });
    useFiltersToogle.mockReturnValue({ isFiltersOpened: false, toggleDeleteModal: () => {} });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders BatchAllocationLogs page', () => {
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

    expect(deleteLog).toHaveBeenCalled();
  });
});
