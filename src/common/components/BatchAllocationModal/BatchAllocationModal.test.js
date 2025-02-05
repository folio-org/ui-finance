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
import { useOkapiKy } from '@folio/stripes/core';

import { useUpcomingFiscalYears } from '../../hooks';
import { fetchFinanceData } from '../../utils';
import { BatchAllocationModal } from './BatchAllocationModal';

jest.mock('../../utils', () => ({
  fetchFinanceData: jest.fn(),
}));
jest.mock('../../hooks', () => ({
  useUpcomingFiscalYears: jest.fn(),
}));

const queryClient = new QueryClient();
const renderComponent = (props) => render(
  <QueryClientProvider client={queryClient}>
    <BatchAllocationModal {...props} />
  </QueryClientProvider>,
);

const fiscalYears = [{ id: 'fy1', code: 'FY2021' }];

describe('BatchAllocationModal', () => {
  const toggleMock = jest.fn();
  const kyMock = { get: jest.fn() };
  const onConfirmMock = jest.fn();

  beforeEach(() => {
    fetchFinanceData.mockReturnValue(() => ({ fyFinanceData: [{ fiscalYearId: 'fy1' }] }));
    useOkapiKy.mockReturnValue(kyMock);
    useUpcomingFiscalYears
      .mockImplementationOnce((_, options) => {
        options?.onSuccess?.({ fiscalYears });

        return { isFetching: false, fiscalYears };
      })
      .mockReturnValue({ isFetching: false, fiscalYears });
  });

  it('should render modal with fiscal year selection', () => {
    renderComponent({ open: true, toggle: toggleMock });

    expect(screen.getByText('ui-finance.selectFiscalYear')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.fiscalyear')).toBeInTheDocument();
    expect(screen.getByText('stripes-components.saveAndClose')).toBeInTheDocument();
  });

  it('should call toggle on cancel', async () => {
    renderComponent({ open: true, toggle: toggleMock });

    await userEvent.click(screen.getByRole('button', { name: 'stripes-components.cancel' }));

    expect(toggleMock).toHaveBeenCalled();
  });

  it('should enable confirm button when fiscal year is selected', () => {
    renderComponent({ open: true, toggle: toggleMock });

    expect(screen.getByText('stripes-components.saveAndClose')).not.toBeDisabled();
  });

  it('should call showCallout and toggle on successful confirm', async () => {
    kyMock.get.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ fyFinanceData: [] }),
    });

    renderComponent({ open: true, onConfirm: onConfirmMock, toggle: toggleMock });

    await userEvent.click(screen.getByRole('button', { name: 'stripes-components.saveAndClose' }));

    await waitFor(() => {
      expect(onConfirmMock).toHaveBeenCalled();
      expect(toggleMock).toHaveBeenCalled();
    });
  });
});
