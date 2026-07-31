import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { useFiscalYears, useLocationFilters } from '@folio/stripes-acq-components';

import Browse from './Browse';
import CheckPermission from '../common/CheckPermission';
import { useBrowseTabEnabled, useFiscalYear } from '../common/hooks';
import { useBrowseHierarchy } from './hooks';
import { BrowseHierarchy } from './BrowseHierarchy';

jest.mock('../common/hooks', () => ({
  ...jest.requireActual('../common/hooks'),
  useBrowseTabEnabled: jest.fn(),
  useFiscalYear: jest.fn(),
}));

jest.mock('./hooks', () => ({
  ...jest.requireActual('./hooks'),
  useBrowseHierarchy: jest.fn(),
}));

jest.mock('../common/CheckPermission', () => jest.fn(({ children }) => children));

jest.mock('../Ledger/LedgerDetails', () => () => <div data-testid="ledger-details">LedgerDetails</div>);

jest.mock('../Groups/GroupDetails', () => ({
  GroupDetailsContainer: () => <div data-testid="group-details">GroupDetails</div>,
}));

jest.mock('../Funds/FundDetails', () => ({
  FundDetailsContainer: () => <div data-testid="fund-details">FundDetails</div>,
}));

jest.mock('../components/Budget/BudgetView', () => () => <div data-testid="budget-view">BudgetView</div>);

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  // eslint-disable-next-line react/prop-types
  PersistedPaneset: (props) => <div>{props.children}</div>,
}));

jest.mock('./BrowseHierarchy', () => ({
  BrowseHierarchy: jest.fn(() => <div data-testid="browse-hierarchy">BrowseHierarchy</div>),
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
      <button data-testid="search-tab-btn" onClick={() => onTabChange('search')} type="button">Search</button>
      <button data-testid="browse-tab-btn" onClick={() => onTabChange('browse')} type="button">Browse</button>
    </div>
  )),
}));

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  TitleManager: ({ children }) => children,
}));

const mockApplyFilters = jest.fn();

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useFiltersToogle: jest.fn(() => ({
    isFiltersOpened: true,
    toggleFilters: jest.fn(),
  })),
  useLocationFilters: jest.fn(() => [
    {},
    '',
    mockApplyFilters,
    jest.fn(),
    jest.fn(),
    jest.fn(),
  ]),
  useFiscalYears: jest.fn(() => ({ fiscalYears: [] })),
  FiltersPane: jest.fn(({ children }) => <div data-testid="filters-pane">{children}</div>),
  ResetButton: jest.fn(({ disabled }) => <button data-testid="reset-button" disabled={disabled} type="button">Reset</button>),
  ResultsPane: jest.fn(({ children, title, subTitle, renderActionMenu }) => (
    <div data-testid="results-pane">
      <span>{title}</span>
      <span>{subTitle}</span>
      {renderActionMenu?.()}
      {typeof children === 'function' ? children({ height: 500 }) : children}
    </div>
  )),
}));

const defaultHierarchyData = {
  hierarchy: [],
  counts: { ledgers: 0, groups: 0, funds: 0, budgets: 0, expenseClasses: 0 },
  isLoading: false,
};

const renderComponent = (history = createMemoryHistory({ initialEntries: ['/finance/browse'] })) => render(
  <Router history={history}>
    <Browse />
  </Router>,
);

describe('Browse', () => {
  beforeEach(() => {
    useBrowseTabEnabled.mockReturnValue(true);
    useFiscalYear.mockReturnValue({ fiscalYear: undefined, isLoading: false });
    useBrowseHierarchy.mockReturnValue(defaultHierarchyData);
    useFiscalYears.mockReturnValue({ fiscalYears: [] });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when browse tab is disabled', () => {
    it('should redirect to ledger route', () => {
      useBrowseTabEnabled.mockReturnValue(false);

      const history = createMemoryHistory({ initialEntries: ['/finance/browse'] });

      renderComponent(history);

      expect(history.location.pathname).toBe('/finance/ledger');
      expect(screen.queryByTestId('results-pane')).not.toBeInTheDocument();
    });
  });

  describe('when browse tab is enabled', () => {
    it('should render the filters pane', () => {
      renderComponent();

      expect(screen.getByTestId('filters-pane')).toBeInTheDocument();
    });

    it('should render the segmented control with browse tab active', () => {
      renderComponent();

      expect(screen.getByTestId('segmented-control')).toBeInTheDocument();
    });

    it('should render the results pane with title and subtitle', () => {
      renderComponent();

      expect(screen.getByTestId('results-pane')).toBeInTheDocument();
      expect(screen.getByText('ui-finance.browse.title')).toBeInTheDocument();
      expect(screen.getByText('ui-finance.browse.subtitle')).toBeInTheDocument();
    });

    it('should render the action menu', () => {
      renderComponent();

      expect(screen.getByTestId('browse-actions-menu')).toBeInTheDocument();
    });

    it('should render the browse filters', () => {
      renderComponent();

      expect(screen.getByTestId('browse-filters')).toBeInTheDocument();
    });

    it('should show "select fiscal year" prompt when no fiscal year is selected', () => {
      renderComponent();

      expect(screen.getByText('ui-finance.browse.selectFiscalYear')).toBeInTheDocument();
      expect(screen.queryByTestId('browse-hierarchy')).not.toBeInTheDocument();
    });

    it('should disable the reset button when there is no active search', () => {
      renderComponent();

      expect(screen.getByTestId('reset-button')).toBeDisabled();
    });
  });

  describe('default fiscal year selection', () => {
    it('should not apply any fiscal year filter when none is currently in the "current" period', () => {
      useFiscalYears.mockReturnValue({
        fiscalYears: [
          { id: 'fy-past', periodStart: '2000-01-01', periodEnd: '2000-12-31' },
        ],
      });

      renderComponent();

      expect(mockApplyFilters).not.toHaveBeenCalled();
    });

    it('should apply the fiscal year whose period contains today as the default', () => {
      const now = new Date();
      const yearAgo = new Date(now);

      yearAgo.setFullYear(now.getFullYear() - 1);

      const yearAhead = new Date(now);

      yearAhead.setFullYear(now.getFullYear() + 1);

      useFiscalYears.mockReturnValue({
        fiscalYears: [
          { id: 'fy-past', periodStart: '2000-01-01', periodEnd: '2000-12-31' },
          { id: 'fy-current', periodStart: yearAgo.toISOString(), periodEnd: yearAhead.toISOString() },
        ],
      });

      renderComponent();

      expect(mockApplyFilters).toHaveBeenCalledWith('fiscalYearId', ['fy-current']);
    });

    it('should not override an already-selected fiscal year', () => {
      useLocationFilters.mockReturnValue([
        { fiscalYearId: ['fy-selected'] },
        '',
        mockApplyFilters,
        jest.fn(),
        jest.fn(),
        jest.fn(),
      ]);

      const now = new Date();
      const yearAhead = new Date(now);

      yearAhead.setFullYear(now.getFullYear() + 1);

      useFiscalYears.mockReturnValue({
        fiscalYears: [
          { id: 'fy-current', periodStart: now.toISOString(), periodEnd: yearAhead.toISOString() },
        ],
      });

      renderComponent();

      expect(mockApplyFilters).not.toHaveBeenCalled();
    });
  });

  describe('when a fiscal year is selected', () => {
    beforeEach(() => {
      useLocationFilters.mockReturnValue([
        { fiscalYearId: ['fy-1'] },
        '',
        mockApplyFilters,
        jest.fn(),
        jest.fn(),
        jest.fn(),
      ]);
      useFiscalYear.mockReturnValue({ fiscalYear: { id: 'fy-1', code: 'FY2024' }, isLoading: false });
    });

    it('should render the hierarchy component', () => {
      renderComponent();

      expect(screen.getByTestId('browse-hierarchy')).toBeInTheDocument();
      expect(screen.queryByText('ui-finance.browse.selectFiscalYear')).not.toBeInTheDocument();
    });

    it('should show the subtitle with counts', () => {
      useBrowseHierarchy.mockReturnValue({
        hierarchy: [{ id: 'led-1', name: 'Ledger', groups: [] }],
        counts: { ledgers: 1, groups: 2, funds: 3, budgets: 4, expenseClasses: 5 },
        isLoading: false,
      });

      renderComponent();

      expect(screen.getByText('ui-finance.browse.subtitle.withCounts')).toBeInTheDocument();
    });
  });

  describe('hierarchy filtering', () => {
    const twoLedgerHierarchy = [
      { id: 'led-active', name: 'Active Ledger', status: 'Active', groups: [] },
      { id: 'led-frozen', name: 'Frozen Ledger', status: 'Frozen', groups: [] },
    ];

    beforeEach(() => {
      useBrowseHierarchy.mockReturnValue({
        hierarchy: twoLedgerHierarchy,
        isLoading: false,
      });
    });

    it('should pass the unfiltered hierarchy through when no status filters are selected', () => {
      useLocationFilters.mockReturnValue([
        { fiscalYearId: ['fy-1'] },
        '',
        mockApplyFilters,
        jest.fn(),
        jest.fn(),
        jest.fn(),
      ]);

      renderComponent();

      const lastCall = BrowseHierarchy.mock.calls[BrowseHierarchy.mock.calls.length - 1][0];

      expect(lastCall.hierarchy).toHaveLength(2);
    });

    it('should only pass ledgers matching the selected ledger status filter', () => {
      useLocationFilters.mockReturnValue([
        { fiscalYearId: ['fy-1'], ledgerStatus: ['Active'] },
        '',
        mockApplyFilters,
        jest.fn(),
        jest.fn(),
        jest.fn(),
      ]);

      renderComponent();

      const lastCall = BrowseHierarchy.mock.calls[BrowseHierarchy.mock.calls.length - 1][0];

      expect(lastCall.hierarchy).toHaveLength(1);
      expect(lastCall.hierarchy[0].id).toBe('led-active');
    });
  });

  describe('tab change handler', () => {
    it('should navigate to ledger route when Search tab is clicked', async () => {
      const history = createMemoryHistory({ initialEntries: ['/finance/browse'] });

      renderComponent(history);

      await userEvent.click(screen.getByTestId('search-tab-btn'));

      expect(history.location.pathname).toBe('/finance/ledger');
    });

    it('should stay on browse when Browse tab is clicked', async () => {
      const history = createMemoryHistory({ initialEntries: ['/finance/browse'] });

      renderComponent(history);

      await userEvent.click(screen.getByTestId('browse-tab-btn'));

      expect(history.location.pathname).toBe('/finance/browse');
      expect(screen.getByTestId('results-pane')).toBeInTheDocument();
    });
  });

  describe('detail view routes', () => {
    it('should render ledger detail view when on ledger route, gated by the correct permission', () => {
      renderComponent(createMemoryHistory({ initialEntries: ['/finance/browse/ledger/led-1/view'] }));

      expect(screen.getByTestId('ledger-details')).toBeInTheDocument();
      expect(CheckPermission).toHaveBeenCalledWith(
        expect.objectContaining({ perm: 'ui-finance.ledger.view' }),
        expect.anything(),
      );
    });

    it('should render group detail view when on group route, gated by the correct permission', () => {
      renderComponent(createMemoryHistory({ initialEntries: ['/finance/browse/group/grp-1/view'] }));

      expect(screen.getByTestId('group-details')).toBeInTheDocument();
      expect(CheckPermission).toHaveBeenCalledWith(
        expect.objectContaining({ perm: 'ui-finance.group.view' }),
        expect.anything(),
      );
    });

    it('should render fund detail view when on fund route, gated by the correct permission', () => {
      renderComponent(createMemoryHistory({ initialEntries: ['/finance/browse/fund/fund-1/view'] }));

      expect(screen.getByTestId('fund-details')).toBeInTheDocument();
      expect(CheckPermission).toHaveBeenCalledWith(
        expect.objectContaining({ perm: 'ui-finance.fund-budget.view' }),
        expect.anything(),
      );
    });

    it('should render budget view when on budget route, gated by the correct permission', () => {
      renderComponent(createMemoryHistory({ initialEntries: ['/finance/browse/budget/bud-1/view'] }));

      expect(screen.getByTestId('budget-view')).toBeInTheDocument();
      expect(CheckPermission).toHaveBeenCalledWith(
        expect.objectContaining({ perm: 'ui-finance.fund-budget.view' }),
        expect.anything(),
      );
    });
  });
});
