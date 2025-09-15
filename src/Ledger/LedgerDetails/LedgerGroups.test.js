import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import ConnectionListing from '../../components/ConnectionListing';
import LedgerGroups from './LedgerGroups';

jest.mock('../../components/ConnectionListing', () => jest.fn().mockReturnValue('ConnectionListing'));
jest.mock('./useRelatedGroups', () => ({
  useRelatedGroups: jest.fn(() => ({ groups: [], isFetching: false })),
}));

const historyMock = {
  push: jest.fn(),
};

const defaultProps = {
  currency: 'USD',
  fiscalYearId: 'fiscalYearId',
  funds: [],
  ledgerId: 'ledgerId',
};

const wrapper = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

const renderLedgerGroups = (props = {}) => render(
  <LedgerGroups
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('LedgerGroups', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render component', () => {
    renderLedgerGroups();

    expect(screen.getByText('ConnectionListing')).toBeInTheDocument();
  });

  it('should open item', async () => {
    renderLedgerGroups();

    ConnectionListing.mock.calls[0][0].openItem({}, { id: 'id' });

    expect(historyMock.push).not.toHaveBeenCalled();
  });
});
