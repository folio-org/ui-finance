import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import SearchBrowseSegmentedControl from './SearchBrowseSegmentedControl';
import { BROWSE_TABS } from '../constants';

const defaultProps = {
  activeTab: BROWSE_TABS.BROWSE,
  onTabChange: jest.fn(),
};

const renderComponent = (props = {}) => render(
  <SearchBrowseSegmentedControl
    {...defaultProps}
    {...props}
  />,
);

describe('SearchBrowseSegmentedControl', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render Search and Browse buttons', () => {
    renderComponent();

    expect(screen.getByText('ui-finance.browse.tab.search')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.browse.tab.browse')).toBeInTheDocument();
  });

  it('should highlight the Browse button when activeTab is BROWSE', () => {
    renderComponent({ activeTab: BROWSE_TABS.BROWSE });

    const browseButton = screen.getByText('ui-finance.browse.tab.browse').closest('button');
    const searchButton = screen.getByText('ui-finance.browse.tab.search').closest('button');

    expect(browseButton).toHaveAttribute('class', expect.stringContaining('primary'));
    expect(searchButton).not.toHaveAttribute('class', expect.stringContaining('primary'));
  });

  it('should highlight the Search button when activeTab is SEARCH', () => {
    renderComponent({ activeTab: BROWSE_TABS.SEARCH });

    const searchButton = screen.getByText('ui-finance.browse.tab.search').closest('button');
    const browseButton = screen.getByText('ui-finance.browse.tab.browse').closest('button');

    expect(searchButton).toHaveAttribute('class', expect.stringContaining('primary'));
    expect(browseButton).not.toHaveAttribute('class', expect.stringContaining('primary'));
  });

  it('should call onTabChange with SEARCH when Search button is clicked', async () => {
    const onTabChange = jest.fn();

    renderComponent({ onTabChange });

    await userEvent.click(screen.getByText('ui-finance.browse.tab.search'));

    expect(onTabChange).toHaveBeenCalledWith(BROWSE_TABS.SEARCH);
  });

  it('should call onTabChange with BROWSE when Browse button is clicked', async () => {
    const onTabChange = jest.fn();

    renderComponent({ onTabChange });

    await userEvent.click(screen.getByText('ui-finance.browse.tab.browse'));

    expect(onTabChange).toHaveBeenCalledWith(BROWSE_TABS.BROWSE);
  });

  it('should render the button group with data-test attribute', () => {
    renderComponent();

    expect(document.querySelector('[data-test-search-browse-navigation]')).toBeInTheDocument();
  });
});
