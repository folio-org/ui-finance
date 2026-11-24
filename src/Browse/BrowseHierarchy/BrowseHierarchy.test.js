import { render, screen, within } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { hierarchyResponse } from 'fixtures';
import { buildHierarchy } from '../utils';
import BrowseHierarchy from './BrowseHierarchy';

const { hierarchy, keysByType } = buildHierarchy(hierarchyResponse);

const renderComponent = () => render(
  <BrowseHierarchy
    fiscalYearName="Fiscal year 2024"
    hierarchy={hierarchy}
    keysByType={keysByType}
  />,
);

const rowsOf = (type) => screen.queryAllByTestId(`hierarchy-row-${type}`);

describe('BrowseHierarchy', () => {
  it('should show the fiscal year', () => {
    renderComponent();

    expect(screen.getByText('Fiscal year 2024')).toBeInTheDocument();
  });

  it('should expand ledgers and groups, and collapse funds and budgets by default', () => {
    renderComponent();

    expect(rowsOf('ledger')).toHaveLength(2);
    expect(rowsOf('group')).toHaveLength(3);
    expect(rowsOf('fund')).toHaveLength(4);
    expect(rowsOf('budget')).toHaveLength(0);
    expect(screen.getByText('ui-finance.browse.hierarchy.collapseLedgers')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.browse.hierarchy.collapseGroups')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.browse.hierarchy.expandFunds')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.browse.hierarchy.expandBudgets')).toBeInTheDocument();
  });

  it('should collapse and expand all ledgers', async () => {
    renderComponent();

    await userEvent.click(screen.getByText('ui-finance.browse.hierarchy.collapseLedgers'));

    expect(rowsOf('ledger')).toHaveLength(2);
    expect(rowsOf('group')).toHaveLength(0);
    expect(screen.getByText('ui-finance.browse.hierarchy.expandLedgers')).toBeInTheDocument();

    await userEvent.click(screen.getByText('ui-finance.browse.hierarchy.expandLedgers'));

    expect(rowsOf('group')).toHaveLength(3);
  });

  it('should collapse and expand all groups, hiding their funds', async () => {
    renderComponent();

    await userEvent.click(screen.getByText('ui-finance.browse.hierarchy.collapseGroups'));

    expect(rowsOf('group')).toHaveLength(3);
    expect(rowsOf('fund')).toHaveLength(0);
    expect(screen.getByText('ui-finance.browse.hierarchy.expandGroups')).toBeInTheDocument();

    await userEvent.click(screen.getByText('ui-finance.browse.hierarchy.expandGroups'));

    expect(rowsOf('fund')).toHaveLength(4);
  });

  it('should expand all funds and then all budgets with their expense classes', async () => {
    renderComponent();

    await userEvent.click(screen.getByText('ui-finance.browse.hierarchy.expandFunds'));

    expect(rowsOf('budget')).toHaveLength(2);
    expect(screen.getByText('ui-finance.browse.hierarchy.collapseFunds')).toBeInTheDocument();
    expect(rowsOf('expenseClass')).toHaveLength(0);

    await userEvent.click(screen.getByText('ui-finance.browse.hierarchy.expandBudgets'));

    expect(rowsOf('expenseClass')).toHaveLength(3);
    expect(screen.getByText('ui-finance.browse.hierarchy.collapseBudgets')).toBeInTheDocument();

    await userEvent.click(screen.getByText('ui-finance.browse.hierarchy.collapseBudgets'));

    expect(rowsOf('expenseClass')).toHaveLength(0);
  });

  it('should toggle a single row independently of the others', async () => {
    renderComponent();

    const [mainLibrary] = rowsOf('ledger');

    await userEvent.click(within(mainLibrary).getByRole('button'));

    expect(rowsOf('group')).toHaveLength(2);
    // not every ledger is expanded anymore
    expect(screen.getByText('ui-finance.browse.hierarchy.expandLedgers')).toBeInTheDocument();
  });
});
