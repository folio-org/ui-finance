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
  useSourceCurrentFiscalYears,
  useSourceData,
  useBatchAllocation,
  useBatchAllocationFormHandler,
  useBatchAllocationMutation,
} from '../hooks';
import { CreateBatchAllocations } from './CreateBatchAllocations';

jest.mock('@folio/stripes-acq-components/lib/hooks', () => ({
  ...jest.requireActual('@folio/stripes-acq-components/lib/hooks'),
  useShowCallout: jest.fn(),
  useTags: jest.fn(() => ({ tags: [] })),
  useTagsConfigs: jest.fn(() => ({ configs: [] })),
  useTagsMutation: jest.fn(() => ({ createTag: jest.fn() })),
}));
jest.mock('../../../common/hooks', () => ({
  ...jest.requireActual('../../../common/hooks'),
  useFiscalYear: jest.fn(),
}));
jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useSourceCurrentFiscalYears: jest.fn(),
  useSourceData: jest.fn(),
  useBatchAllocation: jest.fn(),
  useBatchAllocationFormHandler: jest.fn(),
  useBatchAllocationMutation: jest.fn(),
}));

const wrapper = ({ children }) => (
  <MemoryRouter initialEntries={['/finance/ledger/batch-allocations/create/123']}>
    {children}
  </MemoryRouter>
);

const currentFiscalYear = {
  code: '2025',
  series: 'FY',
  periodStart: '2025-12-01',
};
const selectedFiscalYear = { ...currentFiscalYear };

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
  const recalculate = jest.fn(() => Promise.resolve({ fyFinanceData }));
  const batchAllocate = jest.fn();
  const showCallout = jest.fn();
  const handle = jest.fn(() => Promise.resolve());

  beforeEach(() => {
    useBatchAllocation.mockReturnValue({ budgetsFunds: fyFinanceData, isLoading: false, refetch: () => {} });
    useSourceData.mockReturnValue({ data: { name: 'Source Data' } });
    useFiscalYear.mockReturnValue({ fiscalYear: selectedFiscalYear });
    useBatchAllocationMutation.mockReturnValue({ recalculate, batchAllocate });
    useBatchAllocationFormHandler.mockReturnValue({ handle });
    useSourceCurrentFiscalYears.mockReturnValue({ currentFiscalYears: [currentFiscalYear] });
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

  it('should call handle on submit', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('ui-finance.allocation.batch.form.title.edit')).toBeInTheDocument();
    });

    await userEvent.type(screen.getAllByLabelText('ui-finance.transaction.allocation.batch.columns.budgetAllocationChange')[0], '42');
    await userEvent.click(screen.getByRole('button', { name: 'ui-finance.allocation.batch.form.footer.recalculate' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'stripes-components.saveAndClose' })).not.toBeDisabled();
    });

    await userEvent.click(screen.getByRole('button', { name: 'stripes-components.saveAndClose' }));

    expect(handle).toHaveBeenCalled();
  });

  it('should handle batch allocation error', async () => {
    handle.mockRejectedValueOnce();

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('ui-finance.allocation.batch.form.title.edit')).toBeInTheDocument();
    });

    await userEvent.type(screen.getAllByLabelText('ui-finance.transaction.allocation.batch.columns.budgetAllocationChange')[0], '42');
    await userEvent.click(screen.getByRole('button', { name: 'ui-finance.allocation.batch.form.footer.recalculate' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'stripes-components.saveAndClose' })).not.toBeDisabled();
    });

    await userEvent.click(screen.getByRole('button', { name: 'stripes-components.saveAndClose' }));

    expect(handle).toHaveBeenCalled();
    expect(showCallout).toHaveBeenCalledWith({
      messageId: 'ui-finance.actions.allocations.batch.error',
      type: 'error',
    });
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
