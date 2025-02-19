import localforage from 'localforage';
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
  useBatchAllocation,
  useBatchAllocationMutation,
  useSourceData,
} from '../hooks';
import { UploadBatchAllocations } from './UploadBatchAllocations';
import { BATCH_ALLOCATION_FIELDS } from '../constants';

jest.mock('localforage');

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useShowCallout: jest.fn(),
  useSorting: jest.fn(() => ['field', 'asc', jest.fn()]),
}));

jest.mock('../../../common/hooks', () => ({
  ...jest.requireActual('../../../common/hooks'),
  useFiscalYear: jest.fn(),
}));

jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useBatchAllocation: jest.fn(),
  useBatchAllocationMutation: jest.fn(),
  useSourceData: jest.fn(),
}));

const uploadFileDataStub = [{
  ...fyFinanceData[0],
  [BATCH_ALLOCATION_FIELDS.budgetAllocationChange]: 10,
}];

const defaultProps = {
  history: { push: jest.fn() },
  location: {
    pathname: '/some-path',
    state: {},
  },
  match: {
    params: {
      id: 'source-id',
      fiscalYearId: 'fy-id',
    },
  },
};

const renderComponent = (props = {}) => render(
  <UploadBatchAllocations
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('UploadBatchAllocations', () => {
  const showCalloutMock = jest.fn();
  const recalculate = jest.fn(() => Promise.resolve({ fyFinanceData }));
  const batchAllocate = jest.fn();

  beforeEach(() => {
    localforage.getItem.mockResolvedValue({ fileName: 'test.csv', data: uploadFileDataStub });
    useBatchAllocation.mockReturnValue({ budgetsFunds: fyFinanceData });
    useBatchAllocationMutation.mockReturnValue({ recalculate, batchAllocate });
    useFiscalYear.mockReturnValue({ fiscalYear: { code: '2025' } });
    useShowCallout.mockReturnValue(showCalloutMock);
    useSourceData.mockReturnValue({ data: { name: 'Source Data' } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display error when no file data is found', async () => {
    localforage.getItem.mockResolvedValue(null);

    renderComponent();

    await waitFor(() => {
      expect(showCalloutMock).toHaveBeenCalledWith({
        messageId: 'ui-finance.batchAllocations.upload.error.notFound',
        type: 'error',
      });
    });
  });

  it('should render the batch allocations form when data is available', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('test.csv')).toBeInTheDocument();
    });
  });

  it('should remove file data on submit', async () => {
    useBatchAllocation.mockReturnValue({ budgetsFunds: [fyFinanceData[0]] });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('test.csv')).toBeInTheDocument();
    });

    await userEvent.type(screen.getAllByLabelText('ui-finance.transaction.allocation.batch.columns.budgetAllocationChange')[0], '42');
    await userEvent.click(screen.getByRole('button', { name: 'ui-finance.allocation.batch.form.footer.recalculate' }));
    await userEvent.click(screen.getByRole('button', { name: 'stripes-components.saveAndClose' }));

    await waitFor(() => {
      expect(localforage.removeItem).toHaveBeenCalled();
    });
  });

  it('should navigate back on cancel', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('test.csv')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'stripes-acq-components.FormFooter.cancel' }));

    expect(defaultProps.history.push).toHaveBeenCalled();
  });

  it('should call recalculate on recalculate button click', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('test.csv')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'ui-finance.allocation.batch.form.footer.recalculate' }));

    expect(recalculate).toHaveBeenCalled();
  });
});
