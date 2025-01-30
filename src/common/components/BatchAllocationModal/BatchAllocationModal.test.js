/* Developed collaboratively using AI (Chat GPT) */

import { render, screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { BatchAllocationModal } from './BatchAllocationModal';
import { useUpcomingFiscalYears } from '../../hooks';

jest.mock('../../hooks', () => ({
  useUpcomingFiscalYears: jest.fn(),
}));
jest.mock('react-intl', () => ({
  FormattedMessage: ({ id }) => <span>{id}</span>,
}));
jest.mock('@folio/stripes/components', () => ({
  ConfirmationModal: ({
    open,
    onConfirm,
    onCancel,
    message,
    heading,
    confirmLabel,
    isConfirmButtonDisabled,
  }) => (open ? (
    <div data-testid="confirmation-modal">
      <h2>{heading}</h2>
      {message}
      <button type="button" data-testid="confirm-button" onClick={onConfirm} disabled={isConfirmButtonDisabled}>
        {confirmLabel}
      </button>
      <button type="button" data-testid="cancel-button" onClick={onCancel}>Cancel</button>
    </div>
  ) : null),
  Selection: ({ label, dataOptions, value, onChange, disabled }) => (
    <div>
      <label>{label}</label>
      <select data-testid="selection" value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}>
        {dataOptions.map(({ label, value }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </div>
  ),
  Loading: () => <span data-testid="loading">Loading...</span>,
}));

describe('BatchAllocationModal', () => {
  const toggleMock = jest.fn();
  const onConfirmMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render modal when open', () => {
    useUpcomingFiscalYears.mockReturnValue({
      isFetching: false,
      fiscalYears: [{ id: 'fy1', code: 'FY2024' }],
    });

    render(<BatchAllocationModal groupId="123" open toggle={toggleMock} onConfirm={onConfirmMock} />);

    expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.selectFiscalYear')).toBeInTheDocument();
  });

  it('should show loading indicator when fiscal years are fetching', () => {
    useUpcomingFiscalYears.mockReturnValue({
      isFetching: true,
      fiscalYears: [],
    });

    render(<BatchAllocationModal groupId="123" open toggle={toggleMock} onConfirm={onConfirmMock} />);

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('should disable confirm button when no fiscal year is selected', () => {
    useUpcomingFiscalYears.mockReturnValue({
      isFetching: false,
      fiscalYears: [],
    });

    render(<BatchAllocationModal groupId="123" open toggle={toggleMock} onConfirm={onConfirmMock} />);

    expect(screen.getByTestId('confirm-button')).toBeDisabled();
  });

  it('should enable confirm button when a fiscal year is selected', async () => {
    useUpcomingFiscalYears.mockReturnValue({
      isFetching: false,
      fiscalYears: [{ id: 'fy1', code: 'FY2024' }],
    });

    render(<BatchAllocationModal groupId="123" open toggle={toggleMock} onConfirm={onConfirmMock} />);

    fireEvent.change(screen.getByTestId('selection'), { target: { value: 'fy1' } });

    expect(screen.getByTestId('confirm-button')).toBeEnabled();
  });

  it('should call onConfirm with selected fiscal year when confirm button is clicked', async () => {
    useUpcomingFiscalYears.mockReturnValue({
      isFetching: false,
      fiscalYears: [{ id: 'fy1', code: 'FY2024' }],
    });

    render(<BatchAllocationModal groupId="123" open toggle={toggleMock} onConfirm={onConfirmMock} />);

    fireEvent.change(screen.getByTestId('selection'), { target: { value: 'fy1' } });
    fireEvent.click(screen.getByTestId('confirm-button'));

    expect(onConfirmMock).toHaveBeenCalledTimes(1);
    expect(onConfirmMock).toHaveBeenCalledWith('fy1');
  });

  it('should call toggle when cancel button is clicked', () => {
    useUpcomingFiscalYears.mockReturnValue({
      isFetching: false,
      fiscalYears: [{ id: 'fy1', code: 'FY2024' }],
    });

    render(<BatchAllocationModal groupId="123" open toggle={toggleMock} onConfirm={onConfirmMock} />);

    fireEvent.click(screen.getByTestId('cancel-button'));

    expect(toggleMock).toHaveBeenCalled();
  });

  it('should update selected fiscal year when selection changes', () => {
    useUpcomingFiscalYears.mockReturnValue({
      isFetching: false,
      fiscalYears: [
        { id: 'fy1', code: 'FY2024' },
        { id: 'fy2', code: 'FY2025' },
      ],
    });

    render(<BatchAllocationModal groupId="123" open toggle={toggleMock} onConfirm={onConfirmMock} />);

    fireEvent.change(screen.getByTestId('selection'), { target: { value: 'fy2' } });
    fireEvent.click(screen.getByTestId('confirm-button'));

    expect(onConfirmMock).toHaveBeenCalledWith('fy2');
  });
});
