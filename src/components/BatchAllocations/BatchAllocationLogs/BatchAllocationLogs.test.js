import { MemoryRouter } from 'react-router-dom';

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

const wrapper = ({ children }) => (
  <MemoryRouter initialEntries={['/finance/ledger/batch-allocations/logs']}>
    {children}
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
    useBatchAllocationLogs.mockReturnValue({ data: [], isLoading: false, refetch: () => {} });
    useBatchAllocationLogsMutation.mockReturnValue({ deleteLog: jest.fn() });
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
});
