import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { exportToCsv } from '@folio/stripes/components';
import { useShowCallout } from '@folio/stripes-acq-components';

import { BATCH_ALLOCATIONS_SOURCE } from '../../../const';
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
  ...jest.requireActual('../../../utils'),
  fetchFinanceData: jest.fn(),
}));
jest.mock('../../../hooks', () => ({
  ...jest.requireActual('../../../hooks'),
  useUpcomingFiscalYears: jest.fn(),
}));

const defaultProps = {
  open: true,
  sourceType: BATCH_ALLOCATIONS_SOURCE.ledger,
  toggle: jest.fn(),
};

const renderComponent = (props = {}) => render(
  <DownloadAllocationWorksheetModal
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

const fiscalYears = [{ id: 'fy1', code: 'FY2021' }];

describe('DownloadAllocationWorksheetModal', () => {
  const showCalloutMock = jest.fn();

  beforeEach(() => {
    fetchFinanceData.mockReturnValue(() => ({ fyFinanceData: [{ fiscalYearId: 'fy1' }] }));
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
    renderComponent();

    expect(screen.getByText('ui-finance.selectFiscalYear')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.fiscalyear')).toBeInTheDocument();
    expect(screen.getByText('stripes-core.button.confirm')).toBeInTheDocument();
  });

  it('should call toggle on cancel', async () => {
    renderComponent();

    await userEvent.click(screen.getByRole('button', { name: 'stripes-components.cancel' }));

    expect(defaultProps.toggle).toHaveBeenCalled();
  });

  it('should enable confirm button when fiscal year is selected', () => {
    renderComponent();

    expect(screen.getByText('stripes-core.button.confirm')).toBeEnabled();
  });

  it('should handle CSV worksheet download', async () => {
    renderComponent();

    await userEvent.click(screen.getByRole('button', { name: 'stripes-core.button.confirm' }));

    expect(exportToCsv).toHaveBeenCalled();
    expect(showCalloutMock).toHaveBeenCalledWith({ messageId: 'ui-finance.allocation.worksheet.download.start' });
    expect(defaultProps.toggle).toHaveBeenCalled();
  });
});
