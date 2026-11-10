import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import HierarchyControls from './HierarchyControls';

const renderComponent = (props = {}) => render(
  <HierarchyControls
    expandedTypes={{ ledger: false, group: false, fund: false, budget: false }}
    onToggleType={jest.fn()}
    {...props}
  />,
);

describe('HierarchyControls', () => {
  it('should offer to expand every level that is not fully expanded', () => {
    renderComponent();

    ['Ledgers', 'Groups', 'Funds', 'Budgets'].forEach(level => {
      expect(screen.getByText(`ui-finance.browse.hierarchy.expand${level}`)).toBeInTheDocument();
    });
  });

  it('should offer to collapse a level that is fully expanded', () => {
    renderComponent({ expandedTypes: { ledger: true, group: true, fund: false, budget: false } });

    expect(screen.getByText('ui-finance.browse.hierarchy.collapseLedgers')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.browse.hierarchy.collapseGroups')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.browse.hierarchy.expandFunds')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.browse.hierarchy.expandBudgets')).toBeInTheDocument();
  });

  it('should toggle the level of the clicked link', async () => {
    const onToggleType = jest.fn();

    renderComponent({ onToggleType });
    await userEvent.click(screen.getByText('ui-finance.browse.hierarchy.expandFunds'));

    expect(onToggleType).toHaveBeenCalledWith('fund');
  });
});
