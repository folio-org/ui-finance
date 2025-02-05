import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { BATCH_ALLOCATIONS_SOURCE } from '../../../const';
import { useUpcomingFiscalYears } from '../../../hooks';
import { fetchFinanceData } from '../../../utils';
import { BatchAllocationModal } from './BatchAllocationModal';

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
  <BatchAllocationModal
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

const fiscalYears = [{ id: 'fy1', code: 'FY2021' }];

describe('BatchAllocationModal', () => {
  beforeEach(() => {
    fetchFinanceData.mockReturnValue(() => ({ fyFinanceData: [{ fiscalYearId: 'fy1' }] }));
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
    expect(screen.getByText('stripes-components.saveAndClose')).toBeInTheDocument();
  });

  it('should call toggle on cancel', async () => {
    renderComponent();

    await userEvent.click(screen.getByRole('button', { name: 'stripes-components.cancel' }));

    expect(defaultProps.toggle).toHaveBeenCalled();
  });

  it('should enable confirm button when fiscal year is selected', () => {
    renderComponent();

    expect(screen.getByText('stripes-components.saveAndClose')).not.toBeDisabled();
  });

  it('should handle modal confirm', async () => {
    renderComponent();

    await userEvent.click(screen.getByRole('button', { name: 'stripes-components.saveAndClose' }));

    expect(defaultProps.toggle).toHaveBeenCalled();
  });
});
