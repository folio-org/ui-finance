import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import FundBudgets from '../FundBudgets';
import { FundCurrentBudgetContainer } from './FundCurrentBudgetContainer';
import { BUDGET_ROUTE, BUDGET_VIEW_ROUTE } from '../../../common/const';

jest.mock('../FundBudgets', () => jest.fn().mockReturnValue('FundBudgets'));

const locationMock = { hash: 'hash', pathname: 'pathname', search: 'search' };
const historyMock = {
  push: jest.fn(),
  action: 'PUSH',
  block: jest.fn(),
  createHref: jest.fn(),
  go: jest.fn(),
  listen: jest.fn(),
  location: locationMock,
};
const defaultProps = {
  budget: { id: 'budgetId' },
  currency: 'USD',
  history: historyMock,
  location: locationMock,
  openNewBudgetModal: jest.fn(),
};
const renderFundCurrentBudgetContainer = (props = defaultProps) => render(
  <FundCurrentBudgetContainer {...props} />,
  { wrapper: MemoryRouter },
);

describe('FundCurrentBudgetContainer', () => {
  beforeEach(() => {
    historyMock.push.mockClear();
  });
  it('should display FiscalYearDetails', () => {
    renderFundCurrentBudgetContainer();

    expect(screen.getByText('FundBudgets')).toBeDefined();
  });

  it('should open budget', () => {
    renderFundCurrentBudgetContainer();

    FundBudgets.mock.calls[0][0].openBudget({}, defaultProps.budget);

    expect(historyMock.push.mock.calls[0][0].pathname).toBe(`${BUDGET_ROUTE}${defaultProps.budget.id}${BUDGET_VIEW_ROUTE}`);
  });
});
