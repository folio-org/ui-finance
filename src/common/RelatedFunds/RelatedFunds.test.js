import React from 'react';
import { act, render, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import RelatedFunds from './RelatedFunds';
import ConnectionListing from '../../components/ConnectionListing';

jest.mock('../../components/ConnectionListing', () => jest.fn().mockReturnValue('ConnectionListing'));

const historyMock = {
  push: jest.fn(),
};

const renderRelatedFunds = (mutator, query) => (render(
  <MemoryRouter>
    <RelatedFunds
      history={historyMock}
      query={query}
      mutator={mutator}
    />
  </MemoryRouter>,
));

describe('RelatedFunds', () => {
  let mutator;

  beforeEach(() => {
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
      renderRelatedFunds(mutator, 'budgetQuery');
    });

    expect(mutator.relatedBudgets.GET).toHaveBeenCalled();
  });

  it('should not load related budget data', async () => {
    await act(async () => {
      renderRelatedFunds(mutator);
    });

    expect(mutator.relatedBudgets.GET).not.toHaveBeenCalled();
  });

  it('should open item', async () => {
    await act(async () => {
      renderRelatedFunds(mutator);
    });

    ConnectionListing.mock.calls[0][0].openItem({}, { id: 'id' });

    expect(historyMock.push).not.toHaveBeenCalled();
  });
});
