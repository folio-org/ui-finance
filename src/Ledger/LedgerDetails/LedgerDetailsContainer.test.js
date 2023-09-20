import React from 'react';
import { act, render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter } from 'react-router';
import { useLocalStorage } from '@rehooks/local-storage';

import { LEDGERS_ROUTE } from '../../common/const';
import LedgerDetails from './LedgerDetails';
import { LedgerDetailsContainer } from './LedgerDetailsContainer';

jest.mock('./LedgerDetails', () => jest.fn().mockReturnValue('LedgerDetails'));
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useAllFunds: jest.fn().mockReturnValue({ funds: [] }),
}));

const historyMock = {
  push: jest.fn(),
  action: 'PUSH',
  block: jest.fn(),
  createHref: jest.fn(),
  go: jest.fn(),
  listen: jest.fn(),
};
const mutatorMock = {
  ledgerDetails: {
    GET: jest.fn(),
    DELETE: jest.fn(),
  },
  funds: {
    GET: jest.fn(),
  },
  groupSummaries: {
    GET: jest.fn().mockReturnValue(Promise.resolve([{}])),
  },
  ledgerRollover: {
    GET: jest.fn().mockReturnValue(Promise.resolve([])),
  },
  ledgerRolloverProgress: {
    GET: jest.fn(),
  },
  ledgerRolloverErrors: {
    GET: jest.fn(),
  },
  ledgerCurrentFiscalYear: {
    GET: jest.fn().mockReturnValue(Promise.resolve({ id: 'fyId' })),
  },
  toFiscalYear: {
    GET: jest.fn(),
  },
};
const defaultProps = {
  mutator: mutatorMock,
  match: { params: { id: 'ledgerId' }, path: 'path', url: 'url' },
  history: historyMock,
  location: { hash: 'hash', pathname: 'pathname' },
  stripes: { hasPerm: jest.fn() },
};
const renderLedgerDetailsContainer = (props = defaultProps) => render(
  <LedgerDetailsContainer {...props} />,
  { wrapper: MemoryRouter },
);

describe('LedgerDetailsContainer', () => {
  beforeEach(() => {
    useLocalStorage.mockClear().mockReturnValue([true]);
    historyMock.push.mockClear();
  });
  it('should display LedgerDetails', async () => {
    renderLedgerDetailsContainer();

    await screen.findByText('LedgerDetails');

    expect(screen.getByText('LedgerDetails')).toBeDefined();
  });

  describe('Actions', () => {
    it('should navigate to list when close action is called', async () => {
      await act(async () => renderLedgerDetailsContainer());

      LedgerDetails.mock.calls[0][0].onClose();

      expect(historyMock.push.mock.calls[0][0].pathname).toBe(LEDGERS_ROUTE);
    });

    it('should navigate to form', async () => {
      await act(async () => renderLedgerDetailsContainer());

      LedgerDetails.mock.calls[0][0].onEdit();

      expect(historyMock.push.mock.calls[0][0].pathname).toBe(`${LEDGERS_ROUTE}/${defaultProps.match.params.id}/edit`);
    });

    it('should navigate to rollover', async () => {
      await act(async () => renderLedgerDetailsContainer());

      LedgerDetails.mock.calls[0][0].onRollover();

      expect(historyMock.push.mock.calls[0][0].pathname).toBe(`${LEDGERS_ROUTE}/${defaultProps.match.params.id}/rollover`);
    });

    it('should navigate to rollover logs view', async () => {
      await act(async () => renderLedgerDetailsContainer());

      LedgerDetails.mock.calls[0][0].onRolloverLogs();

      expect(historyMock.push.mock.calls[0][0].pathname).toBe(`${LEDGERS_ROUTE}/${defaultProps.match.params.id}/rollover-logs`);
    });

    it('should remove', async () => {
      mutatorMock.ledgerDetails.DELETE.mockReturnValue(Promise.resolve({}));

      await act(async () => renderLedgerDetailsContainer());

      LedgerDetails.mock.calls[0][0].onDelete();

      expect(mutatorMock.ledgerDetails.DELETE).toHaveBeenCalled();
    });
  });
});
