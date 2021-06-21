import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import queryString from 'query-string';

import { FundsListContainer, buildFundsQuery } from './FundsListContainer';
import FundsList from './FundsList';

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

  it('should load more data', async () => {
    await act(async () => renderFundsListContainer());

    FundsList.mock.calls[0][0].onNeedMoreData();

    expect(defaultProps.mutator.fundsListFunds.GET).toHaveBeenCalled();
  });

  describe('search query', () => {
    it('should build query when search is active', () => {
      const expectedQuery = '(((name="Fund*" or code="Fund*" or externalAccountNo="Fund*" or description="Fund*"))) sortby name/sort.ascending';

      expect(buildFundsQuery(queryString.parse('?query=Fund'))).toBe(expectedQuery);
    });

    it('should build query when search by field is active', () => {
      const expectedQuery = '(((name=Fund*))) sortby name/sort.ascending';

      expect(buildFundsQuery(queryString.parse('?qindex=name&query=Fund'))).toBe(expectedQuery);
    });
  });
});
