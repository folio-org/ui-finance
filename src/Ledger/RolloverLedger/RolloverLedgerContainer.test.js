import user from '@testing-library/user-event';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { useOkapiKy } from '@folio/stripes/core';

import RolloverLedger from './RolloverLedger';
import { RolloverLedgerContainer } from './RolloverLedgerContainer';
import { LEDGERS_ROUTE, LEDGER_ROLLOVER_TYPES } from '../../common/const';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(() => jest.fn()),
}));
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
  mutator: {
    ledgerRollover: {
      POST: jest.fn(() => Promise.resolve()),
    },
  },
  history: historyMock,
  location: locationMock,
  match: { params: { id: 'id' }, path: 'path', url: 'url' },
  resources: {
    rolloverLedger: {
      hasLoaded: true,
      records: [{ id: 'id' }],
    },
  },
  stripes: {
    user: { user: { email: 'ex@mp.le' } },
  },
};
const renderRolloverLedgerContainer = (props = defaultProps) => render(
  <RolloverLedgerContainer {...props} />,
  { wrapper: MemoryRouter },
);

const kyMock = {
  get: jest.fn(() => ({
    json: () => Promise.resolve({ totalRecords: 0 }),
  })),
};

describe('RolloverLedgerContainer', () => {
  beforeEach(() => {
    historyMock.push.mockClear();
    useOkapiKy.mockClear().mockReturnValue(kyMock);
    RolloverLedger.mockClear();
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

  describe('Rollover preview', () => {
    beforeEach(async () => {
      renderRolloverLedgerContainer();

      await act(async () => RolloverLedger.mock.calls[0][0].onSubmit({
        rolloverType: LEDGER_ROLLOVER_TYPES.preview,
        encumbrancesRollover: [{
          orderType: 'Ongoing',
          basedOn: 'Expended',
          increaseBy: '1',
        }],
      }));
    });

    it('should display rollover preview confirmation modal', async () => {
      expect(screen.getByText('ui-finance.ledger.rolloverTest.confirm.message')).toBeInTheDocument();
    });

    it('should call test rollover callback', async () => {
      const confirmBtn = screen.getByText('ui-finance.ledger.rollover.confirm.btn');

      await act(async () => user.click(confirmBtn));

      expect(defaultProps.mutator.ledgerRollover.POST).toHaveBeenCalled();
    });
  });
});
