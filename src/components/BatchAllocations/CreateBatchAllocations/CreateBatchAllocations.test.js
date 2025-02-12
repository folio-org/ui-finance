import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { useFiscalYear } from '../../../common/hooks';
import { BATCH_ALLOCATION_FIELDS } from '../constants';
import {
  useSourceData,
  useBatchAllocation,
  useBatchAllocationFormatter,
  useBatchAllocationMutation,
} from '../hooks';
import { CreateBatchAllocations } from './CreateBatchAllocations';

jest.mock('../../../common/hooks', () => ({
  useFiscalYear: jest.fn(),
}));
jest.mock('../hooks', () => ({
  useSourceData: jest.fn(),
  useBatchAllocation: jest.fn(),
  useBatchAllocationFormatter: jest.fn(),
  useBatchAllocationMutation: jest.fn(),
}));

const wrapper = ({ children }) => (
  <MemoryRouter initialEntries={['/finance/ledger/123/batch-allocations/create']}>
    {children}
  </MemoryRouter>
);

const defaultProps = {
  history: { push: jest.fn() },
  location: { hash: 'hash', pathname: 'pathname' },
  match: { params: { id: '1', fiscalYearId: '2025' } },
};

const renderComponent = (props = {}) => render(
  <CreateBatchAllocations
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('CreateBatchAllocations', () => {
  const recalculate = jest.fn();
  const batchAllocate = jest.fn();

  beforeEach(() => {
    useBatchAllocation.mockReturnValue({ budgetsFunds: [], isLoading: false, refetch: () => {} });
    useSourceData.mockReturnValue({ data: { name: 'Source Data' } });
    useFiscalYear.mockReturnValue({ fiscalYear: { code: '2025' } });
    useBatchAllocationFormatter.mockReturnValue(BATCH_ALLOCATION_FIELDS);
    useBatchAllocationMutation.mockReturnValue({ recalculate, batchAllocate });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders pages headline Batch edit budgets', () => {
    renderComponent();

    expect(screen.getByText('ui-finance.allocation.batch.form.title.edit')).toBeInTheDocument();
  });

  it('should call recalculate on recalculate button click', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('ui-finance.allocation.batch.form.title.edit')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'ui-finance.allocation.batch.form.footer.recalculate' }));

    expect(recalculate).toHaveBeenCalled();
  });
});
