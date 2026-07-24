import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { useLocationFilters } from '@folio/stripes-acq-components';

import Browse from './Browse';
import { useBrowseTabEnabled } from '../common/hooks';

jest.mock('../common/hooks', () => ({
  ...jest.requireActual('../common/hooks'),
  useBrowseTabEnabled: jest.fn(),
}));

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  // eslint-disable-next-line react/prop-types
  PersistedPaneset: (props) => <div>{props.children}</div>,
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

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useFiltersToogle: jest.fn(() => ({
    isFiltersOpened: true,
    toggleFilters: jest.fn(),
  })),
  useLocationFilters: jest.fn(() => [
    {},
    '',
    jest.fn(),
    jest.fn(),
    jest.fn(),
    jest.fn(),
  ]),
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

const renderComponent = (history = createMemoryHistory({ initialEntries: ['/finance/browse'] })) => render(
  <Router history={history}>
    <Browse />
  </Router>,
);

describe('Browse', () => {
  beforeEach(() => {
    useBrowseTabEnabled.mockReturnValue(true);
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

    it('should show "select fiscal year" prompt when no fiscal year filter is applied', () => {
      renderComponent();

      expect(screen.getByText('ui-finance.browse.selectFiscalYear')).toBeInTheDocument();
    });

    it('should show "no results" message when a fiscal year filter is applied', () => {
      useLocationFilters.mockReturnValue([
        { fiscalYearId: ['fy-1'] },
        '',
        jest.fn(),
        jest.fn(),
        jest.fn(),
        jest.fn(),
      ]);

      renderComponent();

      expect(screen.getByText('ui-finance.browse.noResults')).toBeInTheDocument();
      expect(screen.queryByText('ui-finance.browse.selectFiscalYear')).not.toBeInTheDocument();
    });

    it('should disable the reset button when there is no active search', () => {
      renderComponent();

      expect(screen.getByTestId('reset-button')).toBeDisabled();
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
});
