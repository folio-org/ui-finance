import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import CreateTransactionModal from './CreateTransactionModal';

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
  fundsOptions = FUNDS,
  initialValues = { fundId: '1', toFundId: '1' },
  fundLabelId,
  isFundDisabled,
  isFromFundVisible,
  isToFundVisible,
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
        fundLabelId={fundLabelId}
        isFundDisabled={isFundDisabled}
        isFromFundVisible={isFromFundVisible}
        isToFundVisible={isToFundVisible}
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
    expect(screen.getByLabelText('ui-finance.transaction.to').value).toBe('1');
  });

  it('should call submit', () => {
    const onSubmit = jest.fn();

    renderComponent({ onSubmit });
    userEvent.type(screen.getByLabelText('ui-finance.transaction.amount*'), '1000');
    userEvent.click(screen.getByText('ui-finance.transaction.button.confirm'));
    expect(onSubmit).toHaveBeenCalled();
  });

  it('should call cancel', () => {
    const onClose = jest.fn();

    renderComponent({ onClose });
    userEvent.type(screen.getByLabelText('ui-finance.transaction.amount*'), '1000');
    userEvent.click(screen.getByText('ui-finance.transaction.button.cancel'));
    expect(onClose).toHaveBeenCalled();
  });

  it('should show validation error', () => {
    const onSubmit = jest.fn();

    renderComponent({ onSubmit });
    userEvent.type(screen.getByLabelText('ui-finance.transaction.amount*'), '-1000');
    userEvent.click(screen.getByText('ui-finance.transaction.button.confirm'));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('stripes-acq-components.validation.shouldBePositiveAmount')).toBeDefined();
  });

  it('should display only one disabled fund selection with predefined value for increase allocation', () => {
    renderComponent({
      initialValues: { fundId: FUNDS[0].value, fromFundId: FUNDS[0].value },
      fundLabelId: 'ui-finance.fund',
      isToFundVisible: false,
      isFundDisabled: true,
    });

    expect(screen.getByLabelText('ui-finance.fund').value).toBe(FUNDS[0].value);
    expect(screen.getByLabelText('ui-finance.fund')).toHaveAttribute('disabled');
    expect(screen.queryByText('ui-finance.transaction.to')).not.toBeInTheDocument();
    expect(screen.queryByText('ui-finance.transaction.from')).not.toBeInTheDocument();
  });

  it('should display only one disabled fund selection with predefined value for decrease allocation', () => {
    renderComponent({
      initialValues: { fundId: FUNDS[0].value, toFundId: FUNDS[0].value },
      fundLabelId: 'ui-finance.fund',
      isFromFundVisible: false,
      isFundDisabled: true,
    });

    expect(screen.getByLabelText('ui-finance.fund').value).toBe(FUNDS[0].value);
    expect(screen.getByLabelText('ui-finance.fund')).toHaveAttribute('disabled');
    expect(screen.queryByText('ui-finance.transaction.to')).not.toBeInTheDocument();
    expect(screen.queryByText('ui-finance.transaction.from')).not.toBeInTheDocument();
  });
});
