import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import BrowseHierarchy from './BrowseHierarchy';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Loading: () => <div data-testid="loading-spinner">Loading...</div>,
}));

const mockHierarchy = [
  {
    id: 'ledger-1',
    name: 'Main Ledger',
    code: 'ML',
    status: 'Active',
    groups: [
      {
        id: 'group-1',
        name: 'Science',
        code: 'SCI',
        status: 'Active',
        isUngrouped: false,
        funds: [
          {
            id: 'fund-1',
            name: 'Chemistry Fund',
            code: 'CHEM',
            status: 'Active',
            budgets: [
              {
                id: 'budget-1',
                name: 'FY2024-CHEM',
                code: 'FY24-CHEM',
                status: 'Active',
                expenseClasses: [
                  {
                    id: 'ec-1',
                    name: 'Electronic',
                    status: 'Active',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

const defaultCounts = {
  ledgers: 1,
  groups: 1,
  funds: 1,
  budgets: 1,
  expenseClasses: 1,
};

const defaultProps = {
  hierarchy: mockHierarchy,
  counts: defaultCounts,
  fiscalYearCode: 'FY2024',
  isLoading: false,
};

const renderComponent = (props = {}) => render(
  <MemoryRouter>
    <BrowseHierarchy
      {...defaultProps}
      {...props}
    />
  </MemoryRouter>,
);

describe('BrowseHierarchy', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loading state', () => {
    it('should render loading spinner when isLoading is true', () => {
      renderComponent({ isLoading: true });

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('should not render hierarchy when loading', () => {
      renderComponent({ isLoading: true });

      expect(screen.queryByText('Main Ledger (ML)')).not.toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('should render no results message when hierarchy is empty', () => {
      renderComponent({ hierarchy: [] });

      expect(screen.getByText('ui-finance.browse.hierarchy.noResults')).toBeInTheDocument();
    });

    it('should render no results message when hierarchy is undefined (uses default prop)', () => {
      render(
        <MemoryRouter>
          <BrowseHierarchy
            counts={defaultCounts}
            fiscalYearCode="FY2024"
          />
        </MemoryRouter>,
      );

      expect(screen.getByText('ui-finance.browse.hierarchy.noResults')).toBeInTheDocument();
    });

    it('should handle null hierarchy without crashing', () => {
      renderComponent({ hierarchy: null });

      expect(screen.getByText('ui-finance.browse.hierarchy.noResults')).toBeInTheDocument();
    });
  });

  describe('hierarchy rendering', () => {
    it('should render the fiscal year header', () => {
      renderComponent();

      expect(screen.getByText('ui-finance.browse.hierarchy.fiscalYear')).toBeInTheDocument();
      expect(screen.getByText('FY2024')).toBeInTheDocument();
    });

    it('should render the ledger row', () => {
      renderComponent();

      expect(screen.getByText('ui-finance.browse.hierarchy.type.ledger')).toBeInTheDocument();
    });

    it('should render HierarchyControls', () => {
      renderComponent();

      expect(screen.getByText('ui-finance.browse.hierarchy.expandLedgers')).toBeInTheDocument();
    });
  });

  describe('expand/collapse behavior', () => {
    it('should not show groups by default (ledger collapsed)', () => {
      renderComponent();

      expect(screen.queryByText('ui-finance.browse.hierarchy.type.group')).not.toBeInTheDocument();
    });

    it('should expand ledger to show groups on click', async () => {
      renderComponent();

      const expandButton = screen.getByRole('button', { name: 'Expand' });

      await userEvent.click(expandButton);

      expect(screen.getByText('ui-finance.browse.hierarchy.type.group')).toBeInTheDocument();
    });

    it('should expand through multiple levels', async () => {
      renderComponent();

      // Expand ledger
      await userEvent.click(screen.getByRole('button', { name: 'Expand' }));

      // Now group should be visible; expand it
      const expandButtons = screen.getAllByRole('button', { name: 'Expand' });

      await userEvent.click(expandButtons[0]);

      // Fund should be visible
      expect(screen.getByText('ui-finance.browse.hierarchy.type.fund')).toBeInTheDocument();
    });

    it('should collapse a level on second click', async () => {
      renderComponent();

      const expandButton = screen.getByRole('button', { name: 'Expand' });

      await userEvent.click(expandButton);

      expect(screen.getByText('ui-finance.browse.hierarchy.type.group')).toBeInTheDocument();

      const collapseButton = screen.getByRole('button', { name: 'Collapse' });

      await userEvent.click(collapseButton);

      expect(screen.queryByText('ui-finance.browse.hierarchy.type.group')).not.toBeInTheDocument();
    });
  });

  describe('toggle all controls', () => {
    it('should expand all ledgers when "expand ledgers" control is clicked', async () => {
      renderComponent();

      await userEvent.click(screen.getByText('ui-finance.browse.hierarchy.expandLedgers'));

      expect(screen.getByText('ui-finance.browse.hierarchy.type.group')).toBeInTheDocument();
    });

    it('should collapse all ledgers when "collapse ledgers" control is clicked', async () => {
      renderComponent();

      await userEvent.click(screen.getByText('ui-finance.browse.hierarchy.expandLedgers'));

      expect(screen.getByText('ui-finance.browse.hierarchy.type.group')).toBeInTheDocument();

      await userEvent.click(screen.getByText('ui-finance.browse.hierarchy.collapseLedgers'));

      expect(screen.queryByText('ui-finance.browse.hierarchy.type.group')).not.toBeInTheDocument();
    });

    it('should expand and collapse all groups', async () => {
      renderComponent();

      // First expand ledgers to make groups visible
      await userEvent.click(screen.getByText('ui-finance.browse.hierarchy.expandLedgers'));

      // Expand all groups
      await userEvent.click(screen.getByText('ui-finance.browse.hierarchy.expandGroups'));

      expect(screen.getByText('ui-finance.browse.hierarchy.type.fund')).toBeInTheDocument();

      // Collapse all groups
      await userEvent.click(screen.getByText('ui-finance.browse.hierarchy.collapseGroups'));

      expect(screen.queryByText('ui-finance.browse.hierarchy.type.fund')).not.toBeInTheDocument();
    });

    it('should expand and collapse all funds', async () => {
      renderComponent();

      await userEvent.click(screen.getByText('ui-finance.browse.hierarchy.expandLedgers'));
      await userEvent.click(screen.getByText('ui-finance.browse.hierarchy.expandGroups'));

      // Expand all funds
      await userEvent.click(screen.getByText('ui-finance.browse.hierarchy.expandFunds'));

      expect(screen.getByText('ui-finance.browse.hierarchy.type.budget')).toBeInTheDocument();

      // Collapse all funds
      await userEvent.click(screen.getByText('ui-finance.browse.hierarchy.collapseFunds'));

      expect(screen.queryByText('ui-finance.browse.hierarchy.type.budget')).not.toBeInTheDocument();
    });

    it('should expand and collapse all budgets', async () => {
      renderComponent();

      await userEvent.click(screen.getByText('ui-finance.browse.hierarchy.expandLedgers'));
      await userEvent.click(screen.getByText('ui-finance.browse.hierarchy.expandGroups'));
      await userEvent.click(screen.getByText('ui-finance.browse.hierarchy.expandFunds'));

      // Expand all budgets
      await userEvent.click(screen.getByText('ui-finance.browse.hierarchy.expandBudgets'));

      expect(screen.getByText('ui-finance.browse.hierarchy.type.expenseClass')).toBeInTheDocument();

      // Collapse all budgets
      await userEvent.click(screen.getByText('ui-finance.browse.hierarchy.collapseBudgets'));

      expect(screen.queryByText('ui-finance.browse.hierarchy.type.expenseClass')).not.toBeInTheDocument();
    });
  });

  describe('individual item toggling', () => {
    it('should toggle individual group expand/collapse', async () => {
      renderComponent();

      // Expand ledger first
      await userEvent.click(screen.getByRole('button', { name: 'Expand' }));

      // Group should be visible; expand it via its own toggle button
      const groupExpand = screen.getAllByRole('button', { name: 'Expand' })[0];

      await userEvent.click(groupExpand);

      // Fund should now be visible
      expect(screen.getByText('ui-finance.browse.hierarchy.type.fund')).toBeInTheDocument();

      // Collapse group
      const collapseButtons = screen.getAllByRole('button', { name: 'Collapse' });

      // Find the group collapse (not ledger); click the second one since first is ledger
      await userEvent.click(collapseButtons[1]);

      expect(screen.queryByText('ui-finance.browse.hierarchy.type.fund')).not.toBeInTheDocument();
    });

    it('should toggle individual fund expand/collapse', async () => {
      renderComponent();

      // Expand ledger → group
      await userEvent.click(screen.getByText('ui-finance.browse.hierarchy.expandLedgers'));
      await userEvent.click(screen.getByText('ui-finance.browse.hierarchy.expandGroups'));

      // Fund should be visible with its expand button
      const fundExpand = screen.getAllByRole('button', { name: 'Expand' })[0];

      await userEvent.click(fundExpand);

      expect(screen.getByText('ui-finance.browse.hierarchy.type.budget')).toBeInTheDocument();
    });

    it('should toggle individual budget expand/collapse', async () => {
      renderComponent();

      await userEvent.click(screen.getByText('ui-finance.browse.hierarchy.expandLedgers'));
      await userEvent.click(screen.getByText('ui-finance.browse.hierarchy.expandGroups'));
      await userEvent.click(screen.getByText('ui-finance.browse.hierarchy.expandFunds'));

      // Budget should be visible; expand it
      const budgetExpand = screen.getAllByRole('button', { name: 'Expand' })[0];

      await userEvent.click(budgetExpand);

      expect(screen.getByText('ui-finance.browse.hierarchy.type.expenseClass')).toBeInTheDocument();

      // Collapse budget
      const collapseButtons = screen.getAllByRole('button', { name: 'Collapse' });
      const lastCollapse = collapseButtons[collapseButtons.length - 1];

      await userEvent.click(lastCollapse);

      expect(screen.queryByText('ui-finance.browse.hierarchy.type.expenseClass')).not.toBeInTheDocument();
    });
  });

  describe('expense classes', () => {
    it('should show expense classes when budget is expanded', async () => {
      renderComponent();

      // Expand ledger → group → fund → budget
      await userEvent.click(screen.getByText('ui-finance.browse.hierarchy.expandLedgers'));
      await userEvent.click(screen.getByText('ui-finance.browse.hierarchy.expandGroups'));
      await userEvent.click(screen.getByText('ui-finance.browse.hierarchy.expandFunds'));
      await userEvent.click(screen.getByText('ui-finance.browse.hierarchy.expandBudgets'));

      expect(screen.getByText('ui-finance.browse.hierarchy.type.expenseClass')).toBeInTheDocument();
    });
  });

  describe('default props', () => {
    it('should use default values when no props passed', () => {
      render(
        <MemoryRouter>
          <BrowseHierarchy />
        </MemoryRouter>,
      );

      expect(screen.getByText('ui-finance.browse.hierarchy.noResults')).toBeInTheDocument();
    });
  });
});
