import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import FundsListContainer from './FundsListContainer';

jest.mock('./FundsList', () => jest.fn().mockReturnValue('FundsList'));

const defaultProps = {
  mutator: {
    fundsListFunds: {
      GET: jest.fn(),
    },
    fundsListLedgers: {
      GET: jest.fn(),
    },
  },
  location: {},
  history: {},
};

const renderFundsListContainer = (props = defaultProps) => render(
  <FundsListContainer {...props} />,
  { wrapper: MemoryRouter },
);

describe('FundsListContainer', () => {
  beforeEach(() => {
    defaultProps.mutator.fundsListFunds.GET.mockClear();
    defaultProps.mutator.fundsListLedgers.GET.mockClear();
  });

  it('should display FundsList', async () => {
    defaultProps.mutator.fundsListFunds.GET.mockReturnValue(Promise.resolve({
      funds: [],
      totalRecords: 0,
    }));
    defaultProps.mutator.fundsListLedgers.GET.mockReturnValue(Promise.resolve([]));

    await act(async () => renderFundsListContainer());

    expect(screen.getByText('FundsList')).toBeDefined();
  });
});
