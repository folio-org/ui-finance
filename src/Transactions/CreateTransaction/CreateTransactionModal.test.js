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
        initialValues={{
          fundId: '1',
          toFundId: '1',
        }}
      />
    </MemoryRouter>
  </IntlProvider>,
));

describe('CreateTransactionModal', () => {
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
});
