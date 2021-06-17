import React from 'react';
import { act, render, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import RelatedFunds from './RelatedFunds';

jest.mock('../../components/ConnectionListing', () => {
  return jest.fn(() => 'ConnectionListing');
});

const renderRelatedFunds = (mutator, query) => (render(
  <MemoryRouter>
    <RelatedFunds
      history={{}}
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
});
