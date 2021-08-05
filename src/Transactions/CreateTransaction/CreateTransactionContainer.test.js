import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { CreateTransactionContainer } from './CreateTransactionContainer';
import CreateTransactionModal from './CreateTransactionModal';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useAllFunds: jest.fn().mockReturnValue({ funds: [] }),
}));
jest.mock('./CreateTransactionModal', () => jest.fn().mockReturnValue('CreateTransactionModal'));

const mutatorMock = {
  Allocation: {
    POST: jest.fn(),
  },
};

const defaultProps = {
  mutator: mutatorMock,
  budgetName: 'budgetName',
  transactionType: 'Allocation',
  fiscalYearId: 'fiscalYearId',
  fundId: 'fundId',
  onClose: jest.fn(),
  stripes: { hasPerm: jest.fn(), hasInterface: jest.fn(), clone: jest.fn(), logger: {} },
  fetchBudgetResources: jest.fn(),
  allocationType: 'decrease',
  labelId: 'decreaseAllocation',
};

const renderCreateTransactionContainer = (props = defaultProps) => render(
  <div>
    <CreateTransactionContainer
      {...props}
    />
  </div>,
  { wrapper: MemoryRouter },
);

describe('CreateTransactionContainer', () => {
  it('should display BudgetForm', async () => {
    renderCreateTransactionContainer();

    await screen.findByText('CreateTransactionModal');

    expect(screen.getByText('CreateTransactionModal')).toBeDefined();
  });

  it('should close transaction form', () => {
    renderCreateTransactionContainer();

    CreateTransactionModal.mock.calls[0][0].onClose();

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('should save transaction', () => {
    mutatorMock.Allocation.POST.mockReturnValue(Promise.resolve({}));

    renderCreateTransactionContainer();

    CreateTransactionModal.mock.calls[0][0].onSubmit({});

    expect(mutatorMock.Allocation.POST).toHaveBeenCalled();
  });
});
