import { MemoryRouter, Route } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { BROWSE_ROUTE } from '../../common/const';
import { useBrowseTabEnabled } from '../../common/hooks';
import SearchTabControl from './SearchTabControl';

jest.mock('../../common/hooks', () => ({
  useBrowseTabEnabled: jest.fn(),
}));

const renderComponent = () => render(
  <MemoryRouter initialEntries={['/finance/ledger']}>
    <SearchTabControl />
    <Route path="*" render={({ location }) => <div data-testid="path">{location.pathname}</div>} />
  </MemoryRouter>,
);

describe('SearchTabControl', () => {
  it('should not render when the browse tab is disabled', () => {
    useBrowseTabEnabled.mockReturnValue({ isBrowseTabEnabled: false });

    renderComponent();

    expect(screen.queryByText('ui-finance.browse.tab.browse')).not.toBeInTheDocument();
  });

  it('should render both tabs when the browse tab is enabled', () => {
    useBrowseTabEnabled.mockReturnValue({ isBrowseTabEnabled: true });

    renderComponent();

    expect(screen.getByText('ui-finance.browse.tab.search')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.browse.tab.browse')).toBeInTheDocument();
  });

  it('should navigate to browse when the Browse tab is clicked', async () => {
    useBrowseTabEnabled.mockReturnValue({ isBrowseTabEnabled: true });

    renderComponent();
    await userEvent.click(screen.getByText('ui-finance.browse.tab.browse'));

    expect(screen.getByTestId('path')).toHaveTextContent(BROWSE_ROUTE);
  });
});
