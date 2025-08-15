import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';
import { TRANSACTION_TYPES } from '@folio/stripes-acq-components';

import { ALLOCATION_TYPE } from '../constants';
import CreateTransactionModal from './CreateTransactionModal';

const FUNDS = [
  {
    value: 'id-2',
    label: 'fund 2',
  },
  {
    value: 'id-1',
    label: 'fund 1',
  },
];

const budget = {
  allocated: 1000,
  available: 500,
  id: 'budget-id',
  fundId: FUNDS[1].value,
};

const defaultProps = {
  budget,
  fundsOptions: FUNDS,
  initialValues: { fundId: FUNDS[1].value, toFundId: FUNDS[1].value },
  onClose: jest.fn(),
  onSubmit: jest.fn(),
  transactionType: TRANSACTION_TYPES.transfer,
};

const wrapper = ({ children }) => (
  <IntlProvider locale="en">
    <MemoryRouter>
      {children}
    </MemoryRouter>
  </IntlProvider>
);

const renderComponent = (props = {}) => render(
  <CreateTransactionModal
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('CreateTransactionModal', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display from and to fund fields', () => {
    renderComponent();

    expect(screen.queryByText('ui-finance.transaction.to')).toBeInTheDocument();
    expect(screen.queryByText('ui-finance.transaction.from')).toBeInTheDocument();
  });

  it('should preselect fund', () => {
    renderComponent();

    expect(screen.getByRole('button', { name: 'ui-finance.transaction.to fund 1' })).toBeInTheDocument();
  });

  it('should call submit', async () => {
    renderComponent();

    await user.type(screen.getByLabelText('ui-finance.transaction.amount*'), '1000');
    await user.click(screen.getByText('ui-finance.transaction.button.confirm'));

    await waitFor(() => expect(defaultProps.onSubmit).toHaveBeenCalled());
  });

  it('should call cancel', async () => {
    renderComponent();

    await user.type(screen.getByLabelText('ui-finance.transaction.amount*'), '1000');
    await user.click(screen.getByText('ui-finance.transaction.button.cancel'));

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('should show validation error', async () => {
    renderComponent();

    await user.type(screen.getByLabelText('ui-finance.transaction.amount*'), '-1000');
    await user.click(screen.getByText('ui-finance.transaction.button.confirm'));

    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('stripes-acq-components.validation.shouldBePositiveAmount')).toBeInTheDocument();
  });

  it('should display only one disabled fund selection with predefined value for increase allocation', () => {
    renderComponent({
      allocationType: ALLOCATION_TYPE.increase,
      initialValues: { fundId: FUNDS[0].value, toFundId: FUNDS[0].value },
      transactionType: TRANSACTION_TYPES.allocation,
    });

    const selectionBtn = screen.getByRole('button', { name: 'ui-finance.fund fund 2' });

    expect(selectionBtn).toHaveAttribute('disabled');
    expect(selectionBtn).toHaveTextContent(FUNDS[0].label);
    expect(screen.queryByText('ui-finance.transaction.to')).not.toBeInTheDocument();
    expect(screen.queryByText('ui-finance.transaction.from')).not.toBeInTheDocument();
  });

  it('should display only one disabled fund selection with predefined value for decrease allocation', async () => {
    renderComponent({
      allocationType: ALLOCATION_TYPE.decrease,
      initialValues: { fundId: FUNDS[0].value, fromFundId: FUNDS[0].value },
      transactionType: TRANSACTION_TYPES.allocation,
    });

    const selectionBtn = screen.getByRole('button', { name: 'ui-finance.fund fund 2' });

    expect(selectionBtn).toHaveAttribute('disabled');
    expect(selectionBtn).toHaveTextContent(FUNDS[0].label);
    expect(screen.queryByText('ui-finance.transaction.to')).not.toBeInTheDocument();
    expect(screen.queryByText('ui-finance.transaction.from')).not.toBeInTheDocument();
  });

  it('should validate transaction amount for decrease allocation', async () => {
    renderComponent({
      allocationType: ALLOCATION_TYPE.decrease,
      initialValues: { fundId: FUNDS[0].value, fromFundId: FUNDS[0].value },
      transactionType: TRANSACTION_TYPES.allocation,
    });

    // value exceeds total allocated
    await user.type(screen.getByLabelText('ui-finance.transaction.amount*'), '1001');
    await user.click(screen.getByText('ui-finance.transaction.button.confirm'));

    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('ui-finance.transaction.validation.totalAllocatedExceeded')).toBeInTheDocument();
  });

  it('should validate transaction amount for move allocation', async () => {
    renderComponent({
      allocationType: ALLOCATION_TYPE.move,
      initialValues: {
        fundId: FUNDS[1].value,
        fromFundId: FUNDS[1].value,
        toFundId: FUNDS[0].value,
      },
      transactionType: TRANSACTION_TYPES.allocation,
    });

    // value exceeds total allocated for the viewing budget
    await user.type(screen.getByLabelText('ui-finance.transaction.amount*'), '1001');
    await user.click(screen.getByText('ui-finance.transaction.button.confirm'));

    expect(screen.getByText('ui-finance.transaction.validation.totalAllocatedExceeded')).toBeInTheDocument();
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'ui-finance.transaction.button.switchFunds' }));

    // error should be displayed only move allocation is from the viewing budget
    expect(screen.queryByText('ui-finance.transaction.validation.totalAllocatedExceeded')).not.toBeInTheDocument();
  });

  it('should switch values of fromFundId and toFundId when "Switch" button is clicked', async () => {
    renderComponent();

    expect(screen.getByRole('button', { name: /ui-finance.transaction.to/ })).toHaveValue(FUNDS[1].value);
    expect(screen.getByRole('button', { name: /ui-finance.transaction.from/ })).toHaveValue('');

    await user.click(screen.getByRole('button', { name: 'ui-finance.transaction.button.switchFunds' }));

    expect(screen.getByRole('button', { name: /ui-finance.transaction.to/ })).toHaveValue('');
    expect(screen.getByRole('button', { name: /ui-finance.transaction.from/ })).toHaveValue(FUNDS[1].value);
  });
});
