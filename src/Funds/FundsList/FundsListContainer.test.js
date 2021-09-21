import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import { FundsListContainer } from './FundsListContainer';
import { useFunds } from './hooks/useFunds/useFunds';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  usePagination: () => ({}),
}));
jest.mock('./FundsList', () => jest.fn().mockReturnValue('FundsList'));
jest.mock('./hooks/useFunds/useFunds', () => ({
  useFunds: jest.fn(),
}));

const defaultProps = {
  mutator: {
    fundsListLedgers: {
      GET: jest.fn().mockReturnValue({ id: 'id' }),
    },
  },
};

const renderFundsListContainer = (props = {}) => render(
  <FundsListContainer
    {...defaultProps}
    {...props}
  />,
);

describe('FundsListContainer', () => {
  beforeEach(() => {
    defaultProps.mutator.fundsListLedgers.GET.mockClear();
    useFunds
      .mockClear()
      .mockReturnValue({
        funds: [{}],
        totalRecords: 1,
      });
  });

  it('should display FundsList', () => {
    renderFundsListContainer();

    expect(screen.getByText('FundsList')).toBeDefined();
  });

  it('should load ledgers list when fetchReferences is called', async () => {
    renderFundsListContainer();

    await waitFor(() => useFunds.mock.calls[0][0].fetchReferences([{
      id: 'id',
      ledgerId: 'ledgerId',
    }]));

    expect(defaultProps.mutator.fundsListLedgers.GET).toHaveBeenCalledWith({
      params: {
        limit: 1000,
        query: 'id==ledgerId',
      },
    });
  });
});
