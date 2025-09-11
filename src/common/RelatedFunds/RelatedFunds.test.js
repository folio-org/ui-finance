import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import {
  MemoryRouter,
  useHistory,
} from 'react-router-dom';

import { render } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import ConnectionListing from '../../components/ConnectionListing';
import RelatedFunds from './RelatedFunds';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn(),
}));
jest.mock('../../components/ConnectionListing', () => jest.fn().mockReturnValue('ConnectionListing'));

const history = {
  push: jest.fn(),
};

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <MemoryRouter>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </MemoryRouter>
);

const renderRelatedFunds = (props = {}) => render(
  <RelatedFunds
    {...props}
  />,
  { wrapper },
);

const budgets = [{ id: 'budgetId' }];

describe('RelatedFunds', () => {
  const kyMock = {
    get: jest.fn(() => ({
      json: jest.fn().mockResolvedValue({ budgets }),
    })),
  };

  beforeEach(() => {
    useHistory.mockReturnValue(history);
    useOkapiKy.mockReturnValue(kyMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should load related budget data', async () => {
    renderRelatedFunds({ query: 'budgetQuery' });

    expect(kyMock.get).toHaveBeenCalled();
  });

  it('should not load related budget data', async () => {
    renderRelatedFunds();

    expect(kyMock.get).not.toHaveBeenCalled();
  });

  it('should open item', async () => {
    renderRelatedFunds();

    ConnectionListing.mock.calls[0][0].openItem({ target: {} }, { id: 'id' });

    expect(history.push).toHaveBeenCalled();
  });
});
