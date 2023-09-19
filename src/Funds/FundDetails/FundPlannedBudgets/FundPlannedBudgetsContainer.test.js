import React from 'react';
import { act, render, cleanup } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import FundPlannedBudgetsContainer from './FundPlannedBudgetsContainer';
import FundBudgets from '../FundBudgets';

jest.mock('../FundBudgets', () => {
  return jest.fn(() => 'FundBudgets');
});

const locationMock = { hash: 'hash', pathname: 'pathname', search: 'search' };
const historyMock = {
  action: 'PUSH', block: jest.fn(), createHref: jest.fn(), push: jest.fn(), go: jest.fn(), listen: jest.fn(), location: locationMock,
};

const renderFundPlannedBudgetsContainer = (mutator) => (render(
  <MemoryRouter>
    <FundPlannedBudgetsContainer
      history={historyMock}
      location={locationMock}
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

  it('should open budget', async () => {
    mutator.fundPlannedBudgets.GET.mockReturnValue(Promise.resolve([{ fiscalYearId: 'fyId' }]));
    mutator.budgetsFiscalYears.GET.mockReturnValue(Promise.resolve([]));

    await act(async () => {
      renderFundPlannedBudgetsContainer(mutator);
    });

    FundBudgets.mock.calls[0][0].openBudget({}, { id: 'id ' });

    expect(historyMock.push).toHaveBeenCalled();
  });
});
