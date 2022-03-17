import React from 'react';
import user from '@testing-library/user-event';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import AddBudgetModal from './AddBudgetModal';

const mutatorMock = {
  budget: {
    POST: jest.fn(),
  },
};
const locationMock = { hash: 'hash', pathname: 'pathname', search: 'search' };
const FY = {
  id: 'fyId',
  code: 'FY2022',
};
const defaultProps = {
  mutator: mutatorMock,
  location: locationMock,
  history: { push: jest.fn(), action: 'PUSH', block: jest.fn(), createHref: jest.fn(), go: jest.fn(), listen: jest.fn(), location: locationMock, replace: jest.fn() },
  onClose: jest.fn(),
  budgetStatus: 'Active',
  fund: { id: 'fundId' },
  currentFY: FY,
  fiscalYears: [FY],
};

const renderAddBudgetModal = (props = {}) => render(
  <AddBudgetModal
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('AddBudgetModal', () => {
  beforeEach(() => {
    mutatorMock.budget.POST.mockClear();
    defaultProps.onClose.mockClear();
  });

  it('should close the modal', async () => {
    renderAddBudgetModal();

    const cancelBtn = await screen.findByRole('button', {
      name: 'ui-finance.budget.button.cancel',
    });

    user.click(cancelBtn);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('should create a current budget', async () => {
    renderAddBudgetModal();

    const allocatedInput = await screen.findByTestId('budget-allocated-field');
    const saveBtn = await screen.findByRole('button', {
      name: 'ui-finance.budget.save',
    });

    await act(async () => {
      user.type(allocatedInput, '100');
      user.click(saveBtn);
    });

    expect(mutatorMock.budget.POST).toHaveBeenCalledWith(expect.objectContaining({
      budgetStatus: 'Active',
    }));
  });

  it('should create a planned budget', async () => {
    renderAddBudgetModal({
      budgetStatus: 'Planned',
      fiscalYears: [FY, { id: 'newFYId', name: 'FY2023' }],
    });

    const allocatedInput = await screen.findByTestId('budget-allocated-field');
    const saveBtn = await screen.findByRole('button', {
      name: 'ui-finance.budget.save',
    });

    await act(async () => {
      user.type(allocatedInput, '100');
      user.click(saveBtn);
    });

    expect(mutatorMock.budget.POST).toHaveBeenCalledWith(expect.objectContaining({
      budgetStatus: 'Planned',
    }));
  });

  it('should show \'No upcoming FY\' message if there are no upcoming fiscal years', () => {
    renderAddBudgetModal({ budgetStatus: 'Planned' });

    expect(screen.getByText('ui-finance.fund.plannedBudget.noUpcomingFY.label')).toBeInTheDocument();
  });
});
