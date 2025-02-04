import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { useFiscalYear } from '../../../common/hooks';
import { BATCH_ALLOCATION_FIELDS } from '../constants';
import {
  useSourceData,
  useBatchAllocation,
  useBatchAllocationFormatter,
} from '../hooks';
import { CreateBatchAllocations } from './CreateBatchAllocations';

jest.mock('../hooks', () => ({
  useSourceData: jest.fn(),
  useBatchAllocation: jest.fn(),
  useBatchAllocationFormatter: jest.fn(),
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
    useBatchAllocation.mockReturnValue({ budgetsFunds: [], isLoading: false, refetch: () => {} });
    useSourceData.mockReturnValue({ data: { name: 'Source Data' } });
    useFiscalYear.mockReturnValue({ fiscalYear: { code: '2025' } });
    useBatchAllocationFormatter.mockReturnValue(BATCH_ALLOCATION_FIELDS);
  });

  it('renders pages headline Batch edit budgets', () => {
    renderComponent();

    expect(screen.getByText('ui-finance.allocation.batch.form.title.edit')).toBeInTheDocument();
  });
});
