import React from 'react';
import { act, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import BudgetAddModalForm from './AddBudgetModalForm';
import AddBudgetModal from './AddBudgetModal';

jest.mock('./AddBudgetModalForm', () => jest.fn().mockReturnValue('BudgetAddModalForm'));

const mutatorMock = {
  fiscalYears: {
    GET: jest.fn(),
  },
  budget: {
    POST: jest.fn(),
  },
  currentFiscalYear: {
    GET: jest.fn().mockReturnValue(Promise.resolve({ id: 'fyId', series: 'series' })),
  },
};

const defaultProps = {
  mutator: mutatorMock,
  location: {},
  history: {},
  ledgerId: 'ledgerId',
  onClose: jest.fn(),
  budgetStatus: 'Active',
  fund: { id: 'fundId' },
};

const renderAddBudgetModal = (props = defaultProps) => render(
  <AddBudgetModal
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('AddBudgetModal', () => {
  it('should load data', async () => {
    await act(async () => renderAddBudgetModal());

    expect(defaultProps.mutator.fiscalYears.GET).toHaveBeenCalled();
    expect(defaultProps.mutator.currentFiscalYear.GET).toHaveBeenCalled();
  });

  it('should close the modal', () => {
    renderAddBudgetModal();

    BudgetAddModalForm.mock.calls[0][0].onClose();

    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
