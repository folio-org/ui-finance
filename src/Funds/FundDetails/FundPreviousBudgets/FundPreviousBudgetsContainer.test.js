import React from 'react';
import { act, render, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import FundPreviousBudgetsContainer from './FundPreviousBudgetsContainer';

jest.mock('../FundBudgets', () => {
  return jest.fn(() => 'FundBudgets');
});

const renderFundPreviousBudgetsContainer = (mutator) => (render(
  <MemoryRouter>
    <FundPreviousBudgetsContainer
      history={{}}
      location={{}}
      mutator={mutator}
      currentFY={{}}
      fundId="fundId"
      openNewBudgetModal={jest.fn}
    />
  </MemoryRouter>,
));

describe('FundPreviousBudgetsContainer', () => {
  let mutator;

  beforeEach(() => {
    mutator = {
      fundPreviousBudgets: {
        GET: jest.fn(),
      },
      budgetsFiscalYears: {
        GET: jest.fn(),
      },
    };
  });

  afterEach(cleanup);

  it('should load previous budgets data', async () => {
    mutator.fundPreviousBudgets.GET.mockReturnValue(Promise.resolve([{ fiscalYearId: 'fyId' }]));
    mutator.budgetsFiscalYears.GET.mockReturnValue(Promise.resolve([]));

    await act(async () => {
      renderFundPreviousBudgetsContainer(mutator);
    });

    expect(mutator.fundPreviousBudgets.GET).toHaveBeenCalled();
    expect(mutator.budgetsFiscalYears.GET).toHaveBeenCalled();
  });
});
