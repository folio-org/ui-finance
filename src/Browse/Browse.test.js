import { MemoryRouter, Route } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { useFiscalYears } from '@folio/stripes-acq-components';

import { hierarchyResponse } from 'fixtures';
import { LEDGERS_ROUTE } from '../common/const';
import CheckPermission from '../common/CheckPermission';
import { useNavigationSettings } from '../common/hooks';
import Browse from './Browse';
import { useBrowseHierarchy } from './hooks';
import { buildHierarchy } from './utils';

jest.mock('../common/hooks', () => ({
  useNavigationSettings: jest.fn(),
}));
jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  // eslint-disable-next-line react/prop-types
  PersistedPaneset: (props) => <div>{props.children}</div>,
}));
jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Loading: () => <div>Loading</div>,
}));
jest.mock('../common/CheckPermission', () => jest.fn(({ children }) => children));
jest.mock('../Ledger/LedgerDetails', () => () => <div>LedgerDetails</div>);
jest.mock('../Groups/GroupDetails', () => ({ GroupDetailsContainer: () => <div>GroupDetails</div> }));
jest.mock('../Funds/FundDetails', () => ({ FundDetailsContainer: () => <div>FundDetails</div> }));
jest.mock('../components/Budget/BudgetView', () => () => <div>BudgetView</div>);
jest.mock('./hooks', () => ({
  useBrowseHierarchy: jest.fn(),
}));
jest.mock('./BrowseFilters', () => ({
  BrowseFilters: () => <div>BrowseFilters</div>,
}));
jest.mock('./BrowseActionsMenu', () => ({
  BrowseActionsMenu: () => <div>BrowseActionsMenu</div>,
}));
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useFiltersToogle: jest.fn(() => ({ isFiltersOpened: true, toggleFilters: jest.fn() })),
  useFiscalYears: jest.fn(),
}));

const currentFiscalYear = {
  id: 'fy-current',
  name: 'Fiscal year 2024',
  periodStart: '2000-01-01T00:00:00.000+00:00',
  periodEnd: '2999-12-31T23:59:59.000+00:00',
};
const pastFiscalYear = {
  id: 'fy-past',
  name: 'Fiscal year 1990',
  periodStart: '1990-01-01T00:00:00.000+00:00',
  periodEnd: '1990-12-31T23:59:59.000+00:00',
};
const emptyHierarchy = {
  hierarchy: [],
  counts: { ledgers: 0, groups: 0, funds: 0, budgets: 0, expenseClasses: 0 },
  keysByType: {},
  isLoading: false,
};

const renderComponent = (entry = '/finance/browse') => render(
  <MemoryRouter initialEntries={[entry]}>
    <Route path="/finance/browse" component={Browse} />
    <Route path={LEDGERS_ROUTE} render={() => <div>ledgers page</div>} />
  </MemoryRouter>,
);

describe('Browse', () => {
  beforeEach(() => {
    useNavigationSettings.mockReturnValue({ navigationSettings: { enabled: true }, isLoading: false });
    useFiscalYears.mockReturnValue({ fiscalYears: [pastFiscalYear], isLoading: false });
    useBrowseHierarchy.mockClear().mockReturnValue(emptyHierarchy);
  });

  it('should render the tabs, filters and the select fiscal year prompt', () => {
    renderComponent();

    expect(screen.getByText('ui-finance.browse.tab.search')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.browse.tab.browse')).toBeInTheDocument();
    expect(screen.getByText('BrowseFilters')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.browse.selectFiscalYear')).toBeInTheDocument();
  });

  it('should go to the search view when the Search tab is clicked', async () => {
    renderComponent();
    await userEvent.click(screen.getByText('ui-finance.browse.tab.search'));

    expect(screen.getByText('ledgers page')).toBeInTheDocument();
  });

  it('should stay on the browse view when the active Browse tab is clicked', async () => {
    renderComponent();
    await userEvent.click(screen.getByText('ui-finance.browse.tab.browse'));

    expect(screen.queryByText('ledgers page')).not.toBeInTheDocument();
    expect(screen.getByText('ui-finance.browse.selectFiscalYear')).toBeInTheDocument();
  });

  describe('fiscal year', () => {
    beforeEach(() => {
      useFiscalYears.mockReturnValue({ fiscalYears: [pastFiscalYear, currentFiscalYear], isLoading: false });
    });

    it('should select the current fiscal year by default', () => {
      renderComponent();

      expect(useBrowseHierarchy).toHaveBeenLastCalledWith('fy-current');
      expect(screen.queryByText('ui-finance.browse.selectFiscalYear')).not.toBeInTheDocument();
    });

    it('should keep the fiscal year from the URL', () => {
      renderComponent('/finance/browse?fiscalYearId=fy-past');

      expect(useBrowseHierarchy).toHaveBeenLastCalledWith('fy-past');
      expect(useBrowseHierarchy).not.toHaveBeenCalledWith('fy-current');
    });

    it('should not select a fiscal year when none is current', () => {
      useFiscalYears.mockReturnValue({ fiscalYears: [pastFiscalYear], isLoading: false });

      renderComponent();

      expect(useBrowseHierarchy).toHaveBeenLastCalledWith(undefined);
      expect(screen.getByText('ui-finance.browse.selectFiscalYear')).toBeInTheDocument();
    });
  });

  describe('hierarchy', () => {
    beforeEach(() => {
      useFiscalYears.mockReturnValue({ fiscalYears: [currentFiscalYear], isLoading: false });
    });

    it('should show the hierarchy and the counts of the selected fiscal year', () => {
      useBrowseHierarchy.mockReturnValue({ ...buildHierarchy(hierarchyResponse), isLoading: false });

      renderComponent();

      expect(screen.getByText('Fiscal year 2024')).toBeInTheDocument();
      expect(screen.getByText('Main Library (MAIN-LIB)')).toBeInTheDocument();
      expect(screen.getByText('ui-finance.browse.subtitle.withCounts')).toBeInTheDocument();
    });

    it('should show a loading indicator while the hierarchy is loading', () => {
      useBrowseHierarchy.mockReturnValue({ ...emptyHierarchy, isLoading: true });

      renderComponent();

      expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('should tell when the fiscal year has no financial data', () => {
      renderComponent();

      expect(screen.getByText('ui-finance.browse.hierarchy.noResults')).toBeInTheDocument();
    });
  });

  describe('record views', () => {
    beforeEach(() => {
      CheckPermission.mockClear();
    });

    it.each([
      ['/finance/browse/ledger/ledger-1/view', 'LedgerDetails', 'ui-finance.ledger.view'],
      ['/finance/browse/group/group-1/view', 'GroupDetails', 'ui-finance.group.view'],
      ['/finance/browse/fund/fund-1/view', 'FundDetails', 'ui-finance.fund-budget.view'],
      ['/finance/browse/budget/budget-1/view', 'BudgetView', 'ui-finance.fund-budget.view'],
    ])('should show %s in the third pane gated by its permission', (entry, text, perm) => {
      renderComponent(entry);

      expect(screen.getByText(text)).toBeInTheDocument();
      expect(CheckPermission).toHaveBeenCalledWith(expect.objectContaining({ perm }), expect.anything());
    });

    it('should not show a record view on the browse route', () => {
      renderComponent();

      expect(screen.queryByText('LedgerDetails')).not.toBeInTheDocument();
      expect(CheckPermission).not.toHaveBeenCalled();
    });
  });
});
