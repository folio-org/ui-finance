import React from 'react';
import { act, render, cleanup } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import FundPreviousBudgetsContainer from './FundPreviousBudgetsContainer';
import FundBudgets from '../FundBudgets';

jest.mock('../FundBudgets', () => {
  return jest.fn(() => 'FundBudgets');
});

const locationMock = { hash: 'hash', pathname: 'pathname', search: 'search' };
const historyMock = {
  action: 'PUSH', block: jest.fn(), createHref: jest.fn(), push: jest.fn(), go: jest.fn(), listen: jest.fn(), location: locationMock,
};

const renderFundPreviousBudgetsContainer = (mutator) => (render(
  <MemoryRouter>
    <FundPreviousBudgetsContainer
      history={historyMock}
      location={locationMock}
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

  it('should open budget', async () => {
    mutator.fundPreviousBudgets.GET.mockReturnValue(Promise.resolve([{ fiscalYearId: 'fyId' }]));
    mutator.budgetsFiscalYears.GET.mockReturnValue(Promise.resolve([]));

    await act(async () => {
      renderFundPreviousBudgetsContainer(mutator);
    });

    FundBudgets.mock.calls[0][0].openBudget({}, { id: 'id ' });

    expect(historyMock.push).toHaveBeenCalled();
  });
});
