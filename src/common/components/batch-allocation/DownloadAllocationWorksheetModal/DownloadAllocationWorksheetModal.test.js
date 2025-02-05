import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { exportToCsv } from '@folio/stripes/components';
import { useOkapiKy } from '@folio/stripes/core';
import { useShowCallout } from '@folio/stripes-acq-components';

import { useUpcomingFiscalYears } from '../../../hooks';
import { fetchFinanceData } from '../../../utils';
import { DownloadAllocationWorksheetModal } from './DownloadAllocationWorksheetModal';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  exportToCsv: jest.fn(),
}));
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useShowCallout: jest.fn(),
}));
jest.mock('../../../utils', () => ({
  fetchFinanceData: jest.fn(),
}));
jest.mock('../../../hooks', () => ({
  useUpcomingFiscalYears: jest.fn(),
}));

const queryClient = new QueryClient();
const renderComponent = (props) => render(
  <QueryClientProvider client={queryClient}>
    <DownloadAllocationWorksheetModal {...props} />
  </QueryClientProvider>,
);

const fiscalYears = [{ id: 'fy1', code: 'FY2021' }];

describe('DownloadAllocationWorksheetModal', () => {
  const toggleMock = jest.fn();
  const showCalloutMock = jest.fn();
  const kyMock = { get: jest.fn() };

  beforeEach(() => {
    fetchFinanceData.mockReturnValue(() => ({ fyFinanceData: [{ fiscalYearId: 'fy1' }] }));
    useOkapiKy.mockReturnValue(kyMock);
    useShowCallout.mockReturnValue(showCalloutMock);
    useUpcomingFiscalYears
      .mockImplementationOnce((_, options) => {
        options?.onSuccess?.({ fiscalYears });

        return { isFetching: false, fiscalYears };
      })
      .mockReturnValue({ isFetching: false, fiscalYears });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render modal with fiscal year selection', () => {
    renderComponent({ open: true, toggle: toggleMock });

    expect(screen.getByText('ui-finance.selectFiscalYear')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.fiscalyear')).toBeInTheDocument();
    expect(screen.getByText('stripes-core.button.confirm')).toBeInTheDocument();
  });

  it('should call toggle on cancel', async () => {
    renderComponent({ open: true, toggle: toggleMock });

    await userEvent.click(screen.getByRole('button', { name: 'stripes-components.cancel' }));

    expect(toggleMock).toHaveBeenCalled();
  });

  it('should enable confirm button when fiscal year is selected', () => {
    renderComponent({ open: true, toggle: toggleMock });

    expect(screen.getByText('stripes-core.button.confirm')).not.toBeDisabled();
  });

  it('should call showCallout and toggle on successful confirm', async () => {
    kyMock.get.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ fyFinanceData: [] }),
    });

    renderComponent({ open: true, toggle: toggleMock });

    await userEvent.click(screen.getByRole('button', { name: 'stripes-core.button.confirm' }));

    await waitFor(() => {
      expect(exportToCsv).toHaveBeenCalled();
      expect(showCalloutMock).toHaveBeenCalledWith({ messageId: 'ui-finance.allocation.worksheet.download.start' });
      expect(toggleMock).toHaveBeenCalled();
    });
  });
});
