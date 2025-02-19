import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { useShowCallout } from '@folio/stripes-acq-components';

import { fyFinanceData } from 'fixtures';
import { useFiscalYear } from '../../../common/hooks';
import {
  useSourceData,
  useBatchAllocation,
  useBatchAllocationMutation,
} from '../hooks';
import { CreateBatchAllocations } from './CreateBatchAllocations';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useShowCallout: jest.fn(),
}));
jest.mock('../../../common/hooks', () => ({
  ...jest.requireActual('../../../common/hooks'),
  useFiscalYear: jest.fn(),
}));
jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useSourceData: jest.fn(),
  useBatchAllocation: jest.fn(),
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
  const recalculate = jest.fn(() => Promise.resolve({}));
  const batchAllocate = jest.fn();
  const showCallout = jest.fn();

  beforeEach(() => {
    useBatchAllocation.mockReturnValue({ budgetsFunds: fyFinanceData, isLoading: false, refetch: () => {} });
    useSourceData.mockReturnValue({ data: { name: 'Source Data' } });
    useFiscalYear.mockReturnValue({ fiscalYear: { code: '2025' } });
    useBatchAllocationMutation.mockReturnValue({ recalculate, batchAllocate });
    useShowCallout.mockReturnValue(showCallout);
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

  it('should handle recalculate errors', async () => {
    const response = {
      clone: () => response,
      json: () => Promise.resolve({ errors: [{ message: 'Error message' }] }),
    };

    recalculate.mockRejectedValue({ response });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('ui-finance.allocation.batch.form.title.edit')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'ui-finance.allocation.batch.form.footer.recalculate' }));

    expect(recalculate).toHaveBeenCalled();
    expect(showCallout).toHaveBeenCalledWith({
      type: 'error',
      message: 'Error message',
    });
  });
});
