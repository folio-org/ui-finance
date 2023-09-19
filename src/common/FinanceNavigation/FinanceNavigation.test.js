import React from 'react';
import { MemoryRouter } from 'react-router';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import FinanceNavigation from './FinanceNavigation';

const renderFinanceNavigation = (props) => render(
  <FinanceNavigation
    history={{ push: jest.fn() }}
    match={{}}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('FinanceNavigation', () => {
  it('should display tabs', () => {
    renderFinanceNavigation();

    expect(screen.getByText('ui-finance.fiscalyear')).toBeDefined();
    expect(screen.getByText('ui-finance.ledger')).toBeDefined();
    expect(screen.getByText('ui-finance.group')).toBeDefined();
    expect(screen.getByText('ui-finance.fund')).toBeDefined();
  });
});
