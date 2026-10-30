import { MemoryRouter, Route } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { BROWSE_ROUTE, LEDGERS_ROUTE } from '../../common/const';
import { useNavigationSettings } from '../../common/hooks';
import { BROWSE_TABS } from '../constants';
import SearchTabControl from './SearchTabControl';

jest.mock('../../common/hooks', () => ({
  useNavigationSettings: jest.fn(),
}));

const renderComponent = (activeTab, initialPath) => render(
  <MemoryRouter initialEntries={[initialPath]}>
    <SearchTabControl activeTab={activeTab} />
    <Route path="*" render={({ location }) => <div data-testid="path">{location.pathname}</div>} />
  </MemoryRouter>,
);

describe('SearchTabControl', () => {
  beforeEach(() => {
    useNavigationSettings.mockReturnValue({ navigationSettings: { enabled: true }, isLoading: false });
  });

  it('should not render when the browse tab is disabled', () => {
    useNavigationSettings.mockReturnValue({ navigationSettings: { enabled: false }, isLoading: false });

    renderComponent(BROWSE_TABS.SEARCH, LEDGERS_ROUTE);

    expect(screen.queryByText('ui-finance.browse.tab.browse')).not.toBeInTheDocument();
  });

  it('should not render while the settings are loading', () => {
    useNavigationSettings.mockReturnValue({ navigationSettings: undefined, isLoading: true });

    renderComponent(BROWSE_TABS.SEARCH, LEDGERS_ROUTE);

    expect(screen.queryByText('ui-finance.browse.tab.browse')).not.toBeInTheDocument();
  });

  it('should render both tabs when the browse tab is enabled', () => {
    renderComponent(BROWSE_TABS.SEARCH, LEDGERS_ROUTE);

    expect(screen.getByText('ui-finance.browse.tab.search')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.browse.tab.browse')).toBeInTheDocument();
  });

  it('should navigate to browse when the Browse tab is clicked on a search view', async () => {
    renderComponent(BROWSE_TABS.SEARCH, LEDGERS_ROUTE);
    await userEvent.click(screen.getByText('ui-finance.browse.tab.browse'));

    expect(screen.getByTestId('path')).toHaveTextContent(BROWSE_ROUTE);
  });

  it('should stay on the search view when the active Search tab is clicked', async () => {
    renderComponent(BROWSE_TABS.SEARCH, LEDGERS_ROUTE);
    await userEvent.click(screen.getByText('ui-finance.browse.tab.search'));

    expect(screen.getByTestId('path')).toHaveTextContent(LEDGERS_ROUTE);
  });

  it('should navigate to the search view when the Search tab is clicked on browse', async () => {
    renderComponent(BROWSE_TABS.BROWSE, BROWSE_ROUTE);
    await userEvent.click(screen.getByText('ui-finance.browse.tab.search'));

    expect(screen.getByTestId('path')).toHaveTextContent(LEDGERS_ROUTE);
  });

  it('should stay on the browse view when the active Browse tab is clicked', async () => {
    renderComponent(BROWSE_TABS.BROWSE, BROWSE_ROUTE);
    await userEvent.click(screen.getByText('ui-finance.browse.tab.browse'));

    expect(screen.getByTestId('path')).toHaveTextContent(BROWSE_ROUTE);
  });
});
