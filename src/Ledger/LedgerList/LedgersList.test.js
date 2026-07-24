import user from '@folio/jest-config-stripes/testing-library/user-event';
import { act, render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import LedgersList from './LedgersList';
import { useBrowseTabEnabled } from '../../common/hooks';

jest.mock('react-virtualized-auto-sizer', () => jest.fn(
  (props) => <div>{props.children({ width: 123 })}</div>,
));
jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  // eslint-disable-next-line react/prop-types
  PersistedPaneset: (props) => <div>{props.children}</div>,
}));
jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock('@folio/stripes-acq-components', () => {
  return {
    ...jest.requireActual('@folio/stripes-acq-components'),
    useFiltersToogle: jest.fn().mockReturnValue({ isFiltersOpened: true, toggleFilters: jest.fn() }),
    ResetButton: () => <span>ResetButton</span>,
    SingleSearchForm: () => <span>SingleSearchForm</span>,
    useItemToView: () => ({}),
  };
});

jest.mock('./LedgerListFilters', () => jest.fn().mockReturnValue('LedgerListFilters'));
jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  useBrowseTabEnabled: jest.fn(),
}));
jest.mock('../../Browse', () => ({
  ...jest.requireActual('../../Browse/constants'),
  SearchBrowseSegmentedControl: jest.fn(({ onTabChange }) => (
    <button type="button" onClick={() => onTabChange('browse')}>SearchBrowseSegmentedControl</button>
  )),
}));

const defaultProps = {
  onNeedMoreData: jest.fn(),
  resetData: jest.fn(),
  refreshList: jest.fn(),
  ledgersCount: 1,
  ledgers: [{ id: 'ledgerId', name: 'testLedgerName', code: 'TSTLDGR' }],
  pagination: {},
  isLoading: false,
  history: {},
  location: {},
};

const renderLedgersList = (props = defaultProps) => render(
  <LedgersList {...props} />,
  { wrapper: MemoryRouter },
);

describe('LedgersList', () => {
  beforeEach(() => {
    useBrowseTabEnabled.mockReturnValue(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not display the search/browse control when browse tab is disabled', () => {
    renderLedgersList();

    expect(screen.queryByText('SearchBrowseSegmentedControl')).not.toBeInTheDocument();
  });

  it('should display the search/browse control and navigate to browse route when browse tab is enabled', async () => {
    useBrowseTabEnabled.mockReturnValue(true);

    const history = createMemoryHistory();

    render(
      <Router history={history}>
        <LedgersList {...defaultProps} />
      </Router>,
    );

    expect(screen.getByText('SearchBrowseSegmentedControl')).toBeInTheDocument();

    await user.click(screen.getByText('SearchBrowseSegmentedControl'));

    expect(history.location.pathname).toBe('/finance/browse');
  });

  it('should display search control', () => {
    const { getByText } = renderLedgersList();

    expect(getByText('SingleSearchForm')).toBeDefined();
  });

  it('should display reset filters control', () => {
    const { getByText } = renderLedgersList();

    expect(getByText('ResetButton')).toBeDefined();
  });

  it('should display ledger list filters', () => {
    const { getByText } = renderLedgersList();

    expect(getByText('LedgerListFilters')).toBeDefined();
  });

  it('should render ledger results list', async () => {
    renderLedgersList();

    await act(async () => user.click(screen.getByText(defaultProps.ledgers[0].name)));

    expect(await screen.findByText('ui-finance.ledger.name')).toBeInTheDocument();
    expect(await screen.findByText('ui-finance.ledger.code')).toBeInTheDocument();
  });
});
