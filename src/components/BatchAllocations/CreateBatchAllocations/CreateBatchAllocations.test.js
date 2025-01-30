import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { useFiscalYear } from '../../../common/hooks';
import {
  useSourceData,
  useBatchAllocation,
  useBatchAllocationColumnValues,
} from '../hooks';
import { BATCH_ALLOCATION_FIELDS } from '../constants';
import { CreateBatchAllocations } from './CreateBatchAllocations';

jest.mock('../hooks', () => ({
  useSourceData: jest.fn(),
  useBatchAllocation: jest.fn(),
  useBatchAllocationColumnValues: jest.fn(),
}));
jest.mock('../../../common/hooks', () => ({
  useFiscalYear: jest.fn(),
}));

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter initialEntries={['/finance/ledger/123/batch-allocations/create']}>
      {children}
    </MemoryRouter>
  </QueryClientProvider>
);

const defaultProps = {
  match: { params: { id: '1', fiscalYearId: '2025' } },
  location: { hash: 'hash', pathname: 'pathname' },
};

const renderComponent = (props = defaultProps) => render(
  <CreateBatchAllocations {...props} />,
  { wrapper },
);

describe('CreateBatchAllocations', () => {
  beforeEach(() => {
    useBatchAllocation.mockReturnValue({ budgetsFunds: [], isLoading: false });
    useSourceData.mockReturnValue({ data: { name: 'Source Data' } });
    useFiscalYear.mockReturnValue({ fiscalYear: { code: '2025' } });
    useBatchAllocationColumnValues.mockReturnValue(BATCH_ALLOCATION_FIELDS);
  });

  it('renders pages headline Bulk edit budgets', () => {
    renderComponent();

    expect(screen.getByText('ui-finance.allocation.batch.form.title.edit')).toBeInTheDocument();
  });
});
