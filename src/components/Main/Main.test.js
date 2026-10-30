import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { BROWSE_ROUTE, LEDGERS_ROUTE } from '../../common/const';
import { useNavigationSettings } from '../../common/hooks';
import Main from './Main';

jest.mock('../../common/hooks', () => ({
  useNavigationSettings: jest.fn(),
}));
jest.mock('../../Browse', () => ({
  Browse: () => <div>Browse page</div>,
}));
jest.mock('../../FiscalYears', () => ({ FiscalYears: () => <div>Fiscal years page</div> }));
jest.mock('../../Funds', () => () => <div>Funds page</div>);
jest.mock('../../Groups', () => () => <div>Groups page</div>);
jest.mock('../../Ledger', () => ({ Ledger: () => <div>Ledgers page</div> }));
jest.mock('../../Transactions', () => () => <div>Transactions page</div>);
jest.mock('../Budget', () => ({ Budget: () => <div>Budget page</div> }));

const renderComponent = (path) => render(
  <MemoryRouter initialEntries={[path]}>
    <Main />
  </MemoryRouter>,
);

describe('Main', () => {
  it('should register the browse route when the browse tab is enabled', () => {
    useNavigationSettings.mockReturnValue({ navigationSettings: { enabled: true }, isLoading: false });

    renderComponent(BROWSE_ROUTE);

    expect(screen.getByText('Browse page')).toBeInTheDocument();
  });

  it('should not register the browse route and fall back to search when the browse tab is disabled', () => {
    useNavigationSettings.mockReturnValue({ navigationSettings: { enabled: false }, isLoading: false });

    renderComponent(BROWSE_ROUTE);

    expect(screen.queryByText('Browse page')).not.toBeInTheDocument();
    expect(screen.getByText('Ledgers page')).toBeInTheDocument();
  });

  it('should render nothing for the browse route while the setting is loading', () => {
    useNavigationSettings.mockReturnValue({ navigationSettings: undefined, isLoading: true });

    renderComponent(BROWSE_ROUTE);

    expect(screen.queryByText('Browse page')).not.toBeInTheDocument();
    expect(screen.queryByText('Ledgers page')).not.toBeInTheDocument();
  });

  it('should keep the search routes available', () => {
    useNavigationSettings.mockReturnValue({ navigationSettings: { enabled: false }, isLoading: false });

    renderComponent(LEDGERS_ROUTE);

    expect(screen.getByText('Ledgers page')).toBeInTheDocument();
  });
});
