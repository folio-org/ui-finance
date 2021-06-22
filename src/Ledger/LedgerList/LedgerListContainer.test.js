import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import queryString from 'query-string';

import { LedgerListContainer, buildLedgersQuery } from './LedgerListContainer';
import LedgersList from './LedgersList';

jest.mock('./LedgersList', () => jest.fn().mockReturnValue('LedgersList'));

const defaultProps = {
  mutator: {
    ledgersListFinance: {
      GET: jest.fn(),
    },
  },
  location: {},
  history: {},
};

const renderLedgerListContainer = (props = defaultProps) => render(
  <LedgerListContainer {...props} />,
  { wrapper: MemoryRouter },
);

describe('LedgerListContainer', () => {
  beforeEach(() => {
    defaultProps.mutator.ledgersListFinance.GET.mockClear();
  });

  it('should display LedgersList', async () => {
    defaultProps.mutator.ledgersListFinance.GET.mockReturnValue(Promise.resolve({
      ledgers: [],
      totalRecords: 0,
    }));

    await act(async () => renderLedgerListContainer());

    expect(screen.getByText('LedgersList')).toBeDefined();
  });

  it('should load more data', async () => {
    await act(async () => renderLedgerListContainer());

    await act(async () => LedgersList.mock.calls[0][0].onNeedMoreData());

    expect(defaultProps.mutator.ledgersListFinance.GET).toHaveBeenCalled();
  });

  describe('search query', () => {
    it('should build query when search is active', () => {
      const expectedQuery = '(((name="Ledger*" or code="Ledger*" or description="Ledger*"))) sortby name/sort.ascending';

      expect(buildLedgersQuery(queryString.parse('?query=Ledger'))).toBe(expectedQuery);
    });

    it('should build query when search by field is active', () => {
      const expectedQuery = '(((name=Ledger*))) sortby name/sort.ascending';

      expect(buildLedgersQuery(queryString.parse('?qindex=name&query=Ledger'))).toBe(expectedQuery);
    });
  });
});
