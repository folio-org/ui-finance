import React from 'react';
import { act, render, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import FundPlannedBudgetsContainer from './FundPlannedBudgetsContainer';

jest.mock('../FundBudgets', () => {
  return jest.fn(() => 'FundBudgets');
});

const renderFundPlannedBudgetsContainer = (mutator) => (render(
  <MemoryRouter>
    <FundPlannedBudgetsContainer
      history={{}}
      location={{}}
      mutator={mutator}
      currentFY={{}}
      fundId="fundId"
      openNewBudgetModal={jest.fn}
    />
  </MemoryRouter>,
));

describe('FundPlannedBudgetsContainer', () => {
  let mutator;

  beforeEach(() => {
    mutator = {
      fundPlannedBudgets: {
        GET: jest.fn(),
      },
      budgetsFiscalYears: {
        GET: jest.fn(),
      },
    };
  });

  afterEach(cleanup);

  it('should load planned budgets data', async () => {
    mutator.fundPlannedBudgets.GET.mockReturnValue(Promise.resolve([{ fiscalYearId: 'fyId' }]));
    mutator.budgetsFiscalYears.GET.mockReturnValue(Promise.resolve([]));

    await act(async () => {
      renderFundPlannedBudgetsContainer(mutator);
    });

    expect(mutator.fundPlannedBudgets.GET).toHaveBeenCalled();
    expect(mutator.budgetsFiscalYears.GET).toHaveBeenCalled();
  });
});
