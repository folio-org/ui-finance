import user from '@folio/jest-config-stripes/testing-library/user-event';
import { act, render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import LedgersList from './LedgersList';

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
