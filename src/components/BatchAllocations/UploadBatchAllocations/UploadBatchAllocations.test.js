import localforage from 'localforage';
import {
  MemoryRouter,
  useHistory,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';

import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { useShowCallout } from '@folio/stripes-acq-components';

import { fyFinanceData } from 'fixtures';
import { useFiscalYear } from '../../../common/hooks';
import { BATCH_ALLOCATION_FIELDS } from '../constants';
import {
  useBatchAllocation,
  useBatchAllocationFormHandler,
  useBatchAllocationMutation,
  useSourceCurrentFiscalYears,
  useSourceData,
} from '../hooks';
import { UploadBatchAllocations } from './UploadBatchAllocations';

jest.mock('localforage');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn(),
  useLocation: jest.fn(),
  useRouteMatch: jest.fn(),
}));

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
  useBatchAllocationFormHandler: jest.fn(),
  useBatchAllocationMutation: jest.fn(),
  useSourceCurrentFiscalYears: jest.fn(),
  useSourceData: jest.fn(),
}));

const uploadFileDataStub = [{
  ...fyFinanceData[0],
  [BATCH_ALLOCATION_FIELDS.budgetAllocationChange]: 10,
}];

const currentFiscalYear = {
  code: '2025',
  series: 'FY',
  periodStart: '2025-12-01',
};
const selectedFiscalYear = { ...currentFiscalYear };

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

const renderComponent = () => render(
  <UploadBatchAllocations />,
  { wrapper: MemoryRouter },
);

describe('UploadBatchAllocations', () => {
  const showCalloutMock = jest.fn();
  const recalculate = jest.fn(() => Promise.resolve({ fyFinanceData }));
  const batchAllocate = jest.fn();
  const handle = jest.fn(() => Promise.resolve());

  beforeEach(() => {
    localforage.getItem.mockResolvedValue({ fileName: 'test.csv', data: uploadFileDataStub });

    useLocation.mockClear().mockReturnValue(defaultProps.location);
    useHistory.mockClear().mockReturnValue(defaultProps.history);
    useRouteMatch.mockClear().mockReturnValue(defaultProps.match);

    useBatchAllocation.mockReturnValue({ budgetsFunds: fyFinanceData });
    useBatchAllocationFormHandler.mockReturnValue({ handle });
    useBatchAllocationMutation.mockReturnValue({ recalculate, batchAllocate });
    useFiscalYear.mockReturnValue({ fiscalYear: selectedFiscalYear });
    useShowCallout.mockReturnValue(showCalloutMock);
    useSourceCurrentFiscalYears.mockReturnValue({ currentFiscalYears: [currentFiscalYear] });
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
      expect(handle).toHaveBeenCalled();
      expect(localforage.removeItem).toHaveBeenCalled();
    });
  });

  it('should navigate back on cancel', async () => {
    defaultProps.history.push.mockClear();

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('test.csv')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'stripes-acq-components.FormFooter.cancel' }));

    expect(defaultProps.history.push).toHaveBeenCalled();
  });

  it('should handle batch allocation error', async () => {
    handle.mockRejectedValueOnce();
    useBatchAllocation.mockReturnValue({ budgetsFunds: [fyFinanceData[0]] });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('test.csv')).toBeInTheDocument();
    });

    await userEvent.type(screen.getAllByLabelText('ui-finance.transaction.allocation.batch.columns.budgetAllocationChange')[0], '42');
    await userEvent.click(screen.getByRole('button', { name: 'ui-finance.allocation.batch.form.footer.recalculate' }));
    await userEvent.click(screen.getByRole('button', { name: 'stripes-components.saveAndClose' }));

    expect(handle).toHaveBeenCalled();
    expect(showCalloutMock).toHaveBeenCalledWith({
      messageId: 'ui-finance.actions.allocations.batch.error',
      type: 'error',
    });
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
