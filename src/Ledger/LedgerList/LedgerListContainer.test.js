import React from 'react';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { LedgerListContainer } from './LedgerListContainer';
import { useLedgers } from './hooks';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  usePagination: () => ({}),
}));
jest.mock('./LedgersList', () => jest.fn().mockReturnValue('LedgersList'));
jest.mock('./hooks/useLedgers', () => ({
  useLedgers: jest.fn(),
}));

const renderLedgerListContainer = (props = {}) => render(
  <LedgerListContainer {...props} />,
);

describe('LedgerListContainer', () => {
  beforeEach(() => {
    useLedgers
      .mockClear()
      .mockReturnValue({});
  });

  it('should display LedgersList', () => {
    renderLedgerListContainer();

    expect(screen.getByText('LedgersList')).toBeDefined();
  });

  it('should load ledgers list via \'useLedgers\'', () => {
    renderLedgerListContainer();

    expect(useLedgers).toHaveBeenCalled();
  });
});
