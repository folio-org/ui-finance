import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import RolloverLedger from './RolloverLedger';
import { RolloverLedgerContainer } from './RolloverLedgerContainer';
import { LEDGERS_ROUTE } from '../../common/const';

jest.mock('./RolloverLedger', () => jest.fn().mockReturnValue('RolloverLedger'));
jest.mock('./hooks', () => ({
  ...jest.requireActual('./hooks'),
  useRolloverFiscalYears: jest.fn().mockReturnValue({ fiscalYears: [] }),
  useRolloverData: jest.fn().mockReturnValue({
    budgets: [],
    currentFiscalYear: { id: 'fyId' },
    funds: [],
    fundTypesMap: {},
  }),
}));

const locationMock = { hash: 'hash', pathname: 'pathname', search: 'search' };
const historyMock = {
  push: jest.fn(),
  action: 'PUSH',
  block: jest.fn(),
  createHref: jest.fn(),
  go: jest.fn(),
  listen: jest.fn(),
  location: locationMock,
};
const defaultProps = {
  mutator: {},
  history: historyMock,
  location: locationMock,
  match: { params: { id: 'id' }, path: 'path', url: 'url' },
  resources: {
    rolloverLedger: {
      hasLoaded: true,
      records: [{ id: 'id' }],
    },
  },
};
const renderRolloverLedgerContainer = (props = defaultProps) => render(
  <RolloverLedgerContainer {...props} />,
  { wrapper: MemoryRouter },
);

describe('RolloverLedgerContainer', () => {
  beforeEach(() => {
    historyMock.push.mockClear();
  });

  it('should display RolloverLedger', () => {
    renderRolloverLedgerContainer();

    expect(screen.getByText('RolloverLedger')).toBeDefined();
  });

  it('should close', () => {
    renderRolloverLedgerContainer();

    RolloverLedger.mock.calls[0][0].onCancel();

    expect(historyMock.push.mock.calls[0][0].pathname).toBe(`${LEDGERS_ROUTE}/${defaultProps.match.params.id}/view`);
  });

  it('should go to create fiscal year', () => {
    renderRolloverLedgerContainer();

    RolloverLedger.mock.calls[0][0].goToCreateFY();

    expect(historyMock.push.mock.calls[0][0].pathname).toBe(`${LEDGERS_ROUTE}/${defaultProps.match.params.id}/rollover-create-fy`);
  });
});
