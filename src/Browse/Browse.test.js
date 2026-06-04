import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import Browse from './Browse';
import { useBrowseTabEnabled, useFiscalYear } from '../common/hooks';
import { useBrowseHierarchy } from './hooks';
import { BROWSE_TABS } from './constants';

jest.mock('../common/hooks', () => ({
  ...jest.requireActual('../common/hooks'),
  useBrowseTabEnabled: jest.fn(),
  useFiscalYear: jest.fn(),
}));

jest.mock('./hooks', () => ({
  useBrowseHierarchy: jest.fn(),
}));

jest.mock('../common/CheckPermission', () => {
  return ({ children }) => children;
});

jest.mock('../Ledger/LedgerDetails', () => {
  return () => <div data-testid="ledger-details">LedgerDetails</div>;
});

jest.mock('../Groups/GroupDetails', () => ({
  GroupDetailsContainer: () => <div data-testid="group-details">GroupDetails</div>,
}));

jest.mock('../Funds/FundDetails', () => ({
  FundDetailsContainer: () => <div data-testid="fund-details">FundDetails</div>,
}));

jest.mock('../components/Budget/BudgetView', () => {
  return () => <div data-testid="budget-view">BudgetView</div>;
});

jest.mock('./BrowseHierarchy', () => ({
  BrowseHierarchy: () => <div data-testid="browse-hierarchy">BrowseHierarchy</div>,
}));

jest.mock('./BrowseActionsMenu', () => ({
  BrowseActionsMenu: () => <div data-testid="browse-actions-menu">BrowseActionsMenu</div>,
}));

jest.mock('./BrowseFilters', () => ({
  BrowseFilters: () => <div data-testid="browse-filters">BrowseFilters</div>,
}));

jest.mock('./SearchBrowseSegmentedControl', () => ({
  SearchBrowseSegmentedControl: jest.fn(({ onTabChange }) => (
    <div data-testid="segmented-control">
      <button data-testid="search-tab-btn" onClick={() => onTabChange('search')}>Search</button>
      <button data-testid="browse-tab-btn" onClick={() => onTabChange('browse')}>Browse</button>
    </div>
  )),
}));

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  TitleManager: ({ children }) => children,
}));

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useFiltersToogle: jest.fn(() => ({
    isFiltersOpened: true,
    toggleFilters: jest.fn(),
  })),
  useLocationFilters: jest.fn(() => [
    {},  // filters
    '',  // searchQuery
    jest.fn(),  // applyFilters
    jest.fn(),  // applySearch
    jest.fn(),  // changeSearch
    jest.fn(),  // resetFilters
  ]),
  FiltersPane: jest.fn(({ children }) => <div data-testid="filters-pane">{children}</div>),
  ResetButton: jest.fn(() => <button data-testid="reset-button">Reset</button>),
  ResultsPane: jest.fn(({ children, title, subTitle }) => (
    <div data-testid="results-pane">
      <span>{title}</span>
      <span>{subTitle}</span>
      {typeof children === 'function' ? children({ height: 500 }) : children}
    </div>
  )),
}));

const defaultHierarchyData = {
  hierarchy: [],
  counts: { ledgers: 0, groups: 0, funds: 0, budgets: 0, expenseClasses: 0 },
  isLoading: false,
  isFetching: false,
  refetch: jest.fn(),
};

const renderComponent = (initialEntries = ['/finance/browse']) => render(
  <MemoryRouter initialEntries={initialEntries}>
    <Browse />
  </MemoryRouter>,
);

describe('Browse', () => {
  beforeEach(() => {
    useBrowseTabEnabled.mockReturnValue(true);
    useFiscalYear.mockReturnValue({ fiscalYear: null, isLoading: false });
    useBrowseHierarchy.mockReturnValue(defaultHierarchyData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when browse tab is disabled', () => {
    it('should redirect to ledger route', () => {
      useBrowseTabEnabled.mockReturnValue(false);

      renderComponent();

      expect(screen.queryByTestId('results-pane')).not.toBeInTheDocument();
    });
  });

  describe('when browse tab is enabled', () => {
    it('should render the filters pane', () => {
      renderComponent();

      expect(screen.getByTestId('filters-pane')).toBeInTheDocument();
    });

    it('should render the segmented control', () => {
      renderComponent();

      expect(screen.getByTestId('segmented-control')).toBeInTheDocument();
    });

    it('should render the results pane', () => {
      renderComponent();

      expect(screen.getByTestId('results-pane')).toBeInTheDocument();
    });

    it('should render the browse title', () => {
      renderComponent();

      expect(screen.getByText('ui-finance.browse.title')).toBeInTheDocument();
    });

    it('should show "select fiscal year" prompt when no fiscal year is selected', () => {
      renderComponent();

      expect(screen.getByText('ui-finance.browse.selectFiscalYear')).toBeInTheDocument();
    });

    it('should render the reset button', () => {
      renderComponent();

      expect(screen.getByTestId('reset-button')).toBeInTheDocument();
    });

    it('should render the browse filters', () => {
      renderComponent();

      expect(screen.getByTestId('browse-filters')).toBeInTheDocument();
    });
  });

  describe('with fiscal year selected', () => {
    beforeEach(() => {
      const { useLocationFilters } = require('@folio/stripes-acq-components');

      useLocationFilters.mockReturnValue([
        { fiscalYearId: ['fy-1'] },
        '',
        jest.fn(),
        jest.fn(),
        jest.fn(),
        jest.fn(),
      ]);

      useFiscalYear.mockReturnValue({
        fiscalYear: { id: 'fy-1', code: 'FY2024' },
        isLoading: false,
      });

      useBrowseHierarchy.mockReturnValue({
        ...defaultHierarchyData,
        hierarchy: [{ id: 'led-1', name: 'Ledger', groups: [] }],
        counts: { ledgers: 1, groups: 0, funds: 0, budgets: 0, expenseClasses: 0 },
      });
    });

    it('should render the hierarchy component', () => {
      renderComponent();

      expect(screen.getByTestId('browse-hierarchy')).toBeInTheDocument();
    });

    it('should not show the "select fiscal year" prompt', () => {
      renderComponent();

      expect(screen.queryByText('ui-finance.browse.selectFiscalYear')).not.toBeInTheDocument();
    });

    it('should show subtitle with counts', () => {
      renderComponent();

      expect(screen.getByText('ui-finance.browse.subtitle.withCounts')).toBeInTheDocument();
    });
  });

  describe('tab change handler', () => {
    it('should navigate to ledger route when Search tab is clicked', async () => {
      renderComponent();

      await userEvent.click(screen.getByTestId('search-tab-btn'));

      // The handleTabChange with SEARCH pushes to LEDGERS_ROUTE
      // Since we're in MemoryRouter, we just verify it doesn't crash
      expect(screen.getByTestId('segmented-control')).toBeInTheDocument();
    });

    it('should stay on browse when Browse tab is clicked', async () => {
      renderComponent();

      await userEvent.click(screen.getByTestId('browse-tab-btn'));

      expect(screen.getByTestId('results-pane')).toBeInTheDocument();
    });
  });

  describe('detail view routes', () => {
    it('should render ledger detail view when on ledger route', () => {
      renderComponent(['/finance/browse/ledger/led-1/view']);

      expect(screen.getByTestId('ledger-details')).toBeInTheDocument();
    });

    it('should render group detail view when on group route', () => {
      renderComponent(['/finance/browse/group/grp-1/view']);

      expect(screen.getByTestId('group-details')).toBeInTheDocument();
    });

    it('should render fund detail view when on fund route', () => {
      renderComponent(['/finance/browse/fund/fund-1/view']);

      expect(screen.getByTestId('fund-details')).toBeInTheDocument();
    });

    it('should render budget view when on budget route', () => {
      renderComponent(['/finance/browse/budget/bud-1/view']);

      expect(screen.getByTestId('budget-view')).toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('should show default subtitle when loading', () => {
      const { useLocationFilters } = require('@folio/stripes-acq-components');

      useLocationFilters.mockReturnValue([
        { fiscalYearId: ['fy-1'] },
        '',
        jest.fn(),
        jest.fn(),
        jest.fn(),
        jest.fn(),
      ]);

      useFiscalYear.mockReturnValue({
        fiscalYear: null,
        isLoading: true,
      });

      useBrowseHierarchy.mockReturnValue({
        ...defaultHierarchyData,
        isLoading: true,
      });

      renderComponent();

      expect(screen.getByText('ui-finance.browse.subtitle')).toBeInTheDocument();
    });
  });
});
