import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import { render, screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import CreateTransactionModal from './CreateTransactionModal';
import { ALLOCATION_TYPE } from '../constants';

const FUNDS = [
  {
    value: '2',
    label: 'fund 2',
  },
  {
    value: '1',
    label: 'fund 1',
  },
];

const renderComponent = ({
  allocationType,
  fundsOptions = FUNDS,
  initialValues = { fundId: '1', toFundId: '1' },
  onSubmit = () => { },
  onClose = () => { },
}) => (render(
  <IntlProvider locale="en">
    <MemoryRouter>
      <CreateTransactionModal
        fundId="1"
        fundsOptions={fundsOptions}
        onSubmit={onSubmit}
        onClose={onClose}
        title="test title"
        initialValues={initialValues}
        allocationType={allocationType}
      />
    </MemoryRouter>
  </IntlProvider>,
));

describe('CreateTransactionModal', () => {
  it('should display from and to fund fields', () => {
    renderComponent({});

    expect(screen.queryByText('ui-finance.transaction.to')).toBeInTheDocument();
    expect(screen.queryByText('ui-finance.transaction.from')).toBeInTheDocument();
  });

  it('should preselect fund', () => {
    renderComponent({});

    expect(screen.getByRole('button', { name: 'ui-finance.transaction.to fund 1' })).toBeInTheDocument();
  });

  it('should call submit', async () => {
    const onSubmit = jest.fn();

    renderComponent({ onSubmit });

    await user.type(screen.getByLabelText('ui-finance.transaction.amount*'), '1000');
    await user.click(screen.getByText('ui-finance.transaction.button.confirm'));

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
  });

  it('should call cancel', async () => {
    const onClose = jest.fn();

    renderComponent({ onClose });

    user.type(screen.getByLabelText('ui-finance.transaction.amount*'), '1000');
    await user.click(screen.getByText('ui-finance.transaction.button.cancel'));

    expect(onClose).toHaveBeenCalled();
  });

  it('should show validation error', async () => {
    const onSubmit = jest.fn();

    renderComponent({ onSubmit });

    user.type(screen.getByLabelText('ui-finance.transaction.amount*'), '-1000');
    await user.click(screen.getByText('ui-finance.transaction.button.confirm'));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('stripes-acq-components.validation.shouldBePositiveAmount')).toBeDefined();
  });

  it('should display only one disabled fund selection with predefined value for increase allocation', () => {
    renderComponent({
      initialValues: { fundId: FUNDS[0].value, toFundId: FUNDS[0].value },
      allocationType: ALLOCATION_TYPE.increase,
    });

    const selectionBtn = screen.getByRole('button', { name: 'ui-finance.fund fund 2' });

    expect(selectionBtn).toHaveAttribute('disabled');
    expect(selectionBtn).toHaveTextContent(FUNDS[0].label);
    expect(screen.queryByText('ui-finance.transaction.to')).not.toBeInTheDocument();
    expect(screen.queryByText('ui-finance.transaction.from')).not.toBeInTheDocument();
  });

  it('should display only one disabled fund selection with predefined value for decrease allocation', async () => {
    renderComponent({
      initialValues: { fundId: FUNDS[0].value, fromFundId: FUNDS[0].value },
      allocationType: ALLOCATION_TYPE.decrease,
    });

    const selectionBtn = screen.getByRole('button', { name: 'ui-finance.fund fund 2' });

    expect(selectionBtn).toHaveAttribute('disabled');
    expect(selectionBtn).toHaveTextContent(FUNDS[0].label);
    expect(screen.queryByText('ui-finance.transaction.to')).not.toBeInTheDocument();
    expect(screen.queryByText('ui-finance.transaction.from')).not.toBeInTheDocument();
  });
});
