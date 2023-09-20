import React from 'react';
import { act, render, cleanup } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter, useHistory } from 'react-router-dom';

import RelatedFunds from './RelatedFunds';
import ConnectionListing from '../../components/ConnectionListing';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn(),
}));
jest.mock('../../components/ConnectionListing', () => jest.fn().mockReturnValue('ConnectionListing'));

const history = {
  push: jest.fn(),
};

const renderRelatedFunds = ({ mutator, query }) => (render(
  <MemoryRouter>
    <RelatedFunds
      query={query}
      mutator={mutator}
    />
  </MemoryRouter>,
));

describe('RelatedFunds', () => {
  let mutator;

  beforeEach(() => {
    useHistory.mockClear().mockReturnValue(history);
    mutator = {
      relatedBudgets: {
        GET: jest.fn(),
      },
    };
  });

  afterEach(cleanup);

  it('should load related budget data', async () => {
    mutator.relatedBudgets.GET.mockReturnValue(Promise.resolve([]));

    await act(async () => {
      renderRelatedFunds({ mutator, query: 'budgetQuery' });
    });

    expect(mutator.relatedBudgets.GET).toHaveBeenCalled();
  });

  it('should not load related budget data', async () => {
    await act(async () => {
      renderRelatedFunds({ mutator });
    });

    expect(mutator.relatedBudgets.GET).not.toHaveBeenCalled();
  });

  it('should open item', async () => {
    await act(async () => {
      renderRelatedFunds({ mutator });
    });

    ConnectionListing.mock.calls[0][0].openItem({ target: {} }, { id: 'id' });

    expect(history.push).toHaveBeenCalled();
  });
});
