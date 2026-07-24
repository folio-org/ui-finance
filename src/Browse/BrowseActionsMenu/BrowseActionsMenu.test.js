import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { IfPermission } from '@folio/stripes/core';

import BrowseActionsMenu from './BrowseActionsMenu';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  IfPermission: jest.fn(({ children }) => children),
}));

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Icon: jest.fn(({ children }) => <span>{children}</span>),
}));

const renderComponent = (locationSearch = '') => render(
  <MemoryRouter initialEntries={[{ pathname: '/finance/browse', search: locationSearch }]}>
    <BrowseActionsMenu />
  </MemoryRouter>,
);

describe('BrowseActionsMenu', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the menu section', () => {
    renderComponent();

    expect(document.getElementById('browse-actions')).toBeInTheDocument();
  });

  it('should render all four action buttons', () => {
    renderComponent();

    expect(screen.getByText('ui-finance.browse.actions.newFiscalYear')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.browse.actions.newLedger')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.browse.actions.newGroup')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.browse.actions.newFund')).toBeInTheDocument();
  });

  it('should check fiscal year create permission', () => {
    renderComponent();

    expect(IfPermission).toHaveBeenCalledWith(
      expect.objectContaining({ perm: 'ui-finance.fiscal-year.create' }),
      expect.anything(),
    );
  });

  it('should check ledger create permission', () => {
    renderComponent();

    expect(IfPermission).toHaveBeenCalledWith(
      expect.objectContaining({ perm: 'ui-finance.ledger.create' }),
      expect.anything(),
    );
  });

  it('should check group create permission', () => {
    renderComponent();

    expect(IfPermission).toHaveBeenCalledWith(
      expect.objectContaining({ perm: 'ui-finance.group.create' }),
      expect.anything(),
    );
  });

  it('should check fund create permission', () => {
    renderComponent();

    expect(IfPermission).toHaveBeenCalledWith(
      expect.objectContaining({ perm: 'ui-finance.fund-budget.create' }),
      expect.anything(),
    );
  });

  it('should have correct test ids on buttons', () => {
    renderComponent();

    expect(screen.getByTestId('create-fiscal-year-button')).toBeInTheDocument();
    expect(screen.getByTestId('create-ledger-button')).toBeInTheDocument();
    expect(screen.getByTestId('create-group-button')).toBeInTheDocument();
    expect(screen.getByTestId('create-fund-button')).toBeInTheDocument();
  });

  it('should link to correct create routes', () => {
    renderComponent();

    expect(screen.getByTestId('create-fiscal-year-button')).toHaveAttribute('href', '/finance/fiscalyear/create');
    expect(screen.getByTestId('create-ledger-button')).toHaveAttribute('href', '/finance/ledger/create');
    expect(screen.getByTestId('create-group-button')).toHaveAttribute('href', '/finance/groups/create');
    expect(screen.getByTestId('create-fund-button')).toHaveAttribute('href', '/finance/fund/create');
  });

  it('should preserve location search params in links', () => {
    renderComponent('?fiscalYearId=fy-1');

    expect(screen.getByTestId('create-fiscal-year-button')).toHaveAttribute(
      'href',
      expect.stringContaining('?fiscalYearId=fy-1'),
    );
  });
});
