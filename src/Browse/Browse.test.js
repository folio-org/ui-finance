import { MemoryRouter, Route } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { LEDGERS_ROUTE } from '../common/const';
import { useNavigationSettings } from '../common/hooks';
import Browse from './Browse';

jest.mock('../common/hooks', () => ({
  useNavigationSettings: jest.fn(),
}));
jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  // eslint-disable-next-line react/prop-types
  PersistedPaneset: (props) => <div>{props.children}</div>,
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
}));

const renderComponent = () => render(
  <MemoryRouter initialEntries={['/finance/browse']}>
    <Route path="/finance/browse" component={Browse} />
    <Route path={LEDGERS_ROUTE} render={() => <div>ledgers page</div>} />
  </MemoryRouter>,
);

describe('Browse', () => {
  beforeEach(() => {
    useNavigationSettings.mockReturnValue({ navigationSettings: { enabled: true }, isLoading: false });
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
});
