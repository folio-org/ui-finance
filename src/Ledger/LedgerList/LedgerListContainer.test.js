import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import LedgerListContainer from './LedgerListContainer';

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

  it('should display LedgersList', () => {
    defaultProps.mutator.ledgersListFinance.GET.mockReturnValue(Promise.resolve([]));
    renderLedgerListContainer();

    expect(screen.getByText('LedgersList')).toBeDefined();
  });
});
