import React from 'react';
import { act, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import BudgetAddModalForm from './AddBudgetModalForm';
import AddBudgetModal from './AddBudgetModal';

jest.mock('./AddBudgetModalForm', () => jest.fn().mockReturnValue('BudgetAddModalForm'));

const mutatorMock = {
  fiscalYears: {
    GET: jest.fn().mockReturnValue(Promise.resolve([{ id: 'fyId' }])),
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
  location: { hash: 'hash', pathname: 'pathname', search: 'search' },
  history: { action: 'PUSH', block: jest.fn(), createHref: jest.fn(), go: jest.fn(), listen: jest.fn() },
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

  it('should close the modal', async () => {
    await act(async () => renderAddBudgetModal());

    BudgetAddModalForm.mock.calls[0][0].onClose();

    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
