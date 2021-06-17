import React from 'react';
import { act, render, cleanup } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import BudgetViewContainer from './BudgetViewContainer';

jest.mock('./BudgetView', () => {
  return jest.fn(() => 'BudgetView');
});

const renderBudgetViewContainer = (mutator) => (render(
  <IntlProvider locale="en">
    <MemoryRouter>
      <BudgetViewContainer
        history={{}}
        location={{}}
        match={{ params: { id: '001' } }}
        mutator={mutator}
      />
    </MemoryRouter>
  </IntlProvider>,
));

describe('BudgetViewContainer', () => {
  let mutator;

  beforeEach(() => {
    mutator = {
      budgetById: {
        GET: jest.fn(),
      },
      budgetFiscalYear: {
        GET: jest.fn(),
      },
      expenseClassesTotals: {
        GET: jest.fn(),
      },
    };
  });

  afterEach(cleanup);

  it('should load all data', async () => {
    mutator.budgetById.GET.mockReturnValue(Promise.resolve({}));
    mutator.budgetFiscalYear.GET.mockReturnValue(Promise.resolve({}));
    mutator.expenseClassesTotals.GET.mockReturnValue(Promise.resolve([]));

    await act(async () => {
      renderBudgetViewContainer(mutator);
    });

    expect(mutator.budgetById.GET).toHaveBeenCalled();
    expect(mutator.budgetFiscalYear.GET).toHaveBeenCalled();
    expect(mutator.expenseClassesTotals.GET).toHaveBeenCalled();
  });
});
